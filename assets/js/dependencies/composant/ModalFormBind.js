(function($) { 

    $.fn.ModalFormBind = function(opts) {
      Array.prototype.inArray = function (value) {
        var i;
        for (i = 0; i < this.length; i++) {
          if (this[i] == value)
            return true;
        }
        return false;
      };
      //calculs des prix
      function calculPV(ht,txCom,tva) {
        ht = parseFloat(ht);
        txCom = parseFloat(txCom);
        tva = parseFloat(tva);

        var tt1 = ht +( (txCom*ht)/100 );
        var resultat = tt1 + ((tt1*tva)/100);
       
        return Math.round(resultat *100)/100;
      }
      function calculHT(ttc_achat,tva) {
        var resultat = parseFloat(ttc_achat) /(1 + (parseFloat(tva)/100) );
        return Math.round(resultat *100)/100;
      }
      //gestion des uploads de fichiers


      //gestion des cas particuliers
      function specificite(datas) {
        if(opts.resource == 'produits') {
          $("#imgIcon").attr('src',datas.data['icone']);
          $("#ttc_vente").attr('disabled','disabled');
          $("#pht").attr('disabled','disabled'); 
          $("#icone").hide();
          $("#disponibilite").hide();
          if(datas.data["icone"] !== null && datas.data["icone"] !== undefined)
            var dvIcone = "<img id='imgIcon' class='pictoImg' src='" + datas.data["icone"] + "'>";
          else
            var dvIcone = "<img id='imgIcon' class='pictoImg' src='/images/uploads/no_image.png'>";

         
          var btnImg = "<input id='icon' type='file' name='icone' style='display:none'>";
          btnImg += "<input type='button' id='chImg' value='...'>";
          $("#icone").after(dvIcone + btnImg);
          var currentDispo = "";
          var newClass = "";
          if(datas.data["disponibilite"] <= 0 || datas.data["disponibilite"] == null || datas.data["disponibilite"] == "null") {
            currentDispo = 0;
            var dvDispo = "<div id='dvDispo' class='indisponible'>indisponible</div>";
          } else {
            currentDispo = 1;
            var dvDispo = "<div id='dvDispo' class='disponible'>disponible</div>";
          }
          
          $("#disponibilite").after(dvDispo);
          $("#dvDispo").click (function() {
            if(currentDispo <= 0) {
              newClass = "disponible"; 
              $("#disponibilite").val("1");
            }
            else {
              newClass = "indisponible";
              $("#disponibilite").val("0");
            }
            $(this).removeClass(".indisponible").removeClass(".disponible").addClass(newClass);
          });

          $("#chImg").click (function() {
            $("#icon").click();
          });

          $("#icon").on('change', function(){
            var files = $(this).get(0).files;
            if (files.length > 0){
              // create a FormData object which will be sent as the data payload in the
              // AJAX request
              var formData = new FormData();
              var produits = {'type': $("#id_type").val()};
              // loop through all the selected files and add them to the formData object
              for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // add the files to formData object for the data payload
                formData.append('icone', file, file.name);
                console.log("nom fichier : ", file.name);
              }
              console.log("files detectes ", files.length);
              $.ajax({
                url: '/produits/upload',
                type: 'POST',
                data: formData,
                produits: produits,
                processData: false,
                contentType: false,
                success: function(data){
                    console.log('upload successful!\n' + data);
                    $("#icone").val(data.filepath);
                    $("#imgIcon").attr('src',data.filepath);
                }
              });

            }
          });

          $("#tva").addClass("price");
          $("#tx_com").addClass("price");
          $("#ttc_externe").addClass("price");
          $('body').on('change', 'input.price', function (event) {
            //Application des regles de calculs
            var currentChanged = $(this).attr('id');
            console.log(currentChanged);
            if (currentChanged == 'tva') {
              if($("#ttc_externe").val() != '') 
                $("#pht").val(calculHT( $("#ttc_externe").val(), $("#tva").val() ));
              if($("#pht").val() != '' && $("#tx_com").val() != '')
                 $("#ttc_vente").val(calculPV( $("#pht").val(), $("#tx_com").val(), $("#tva").val() ));
            }
            if (currentChanged == 'ttc_externe') {
              if($("#tva").val() != '') {
                $("#pht").val(calculHT( $("#ttc_externe").val(), $("#tva").val() ));
                if ($("#tx_com").val() != '') 
                  $("#ttc_vente").val(calculPV( $("#pht").val(), $("#tx_com").val(), $("#tva").val() ));
              }
            }
            if (currentChanged == 'tx_com') {
              if($("#pht").val() != '' && $("#tva").val() != '')
                 $("#ttc_vente").val( calculPV( $("#pht").val(), $("#tx_com").val(), $("#tva").val() ));
            }
          });
        }

      }

     //atteignable par parametres.curenIdx, etc...
      var defauts = {
          'externalFields': [],
          'parentId': $(this).attr('id'),
          'une_contrainte': function () {
              return "ok";               
           }
      };

      var parametres = $.extend(defauts, opts);     
      //panel arrondi
      //$(this).attr("style","float:left; margin-top: 30px;margin-bottom:3px; width:280px;padding: 10px 20px 20px; line-height: 1; color:#fff; -moz-border-radius: 30px; -webkit-border-radius: 30px; border-radius: 30px; background:linear-gradient(to top,#ED283F,#ED7171)");
       //var lec = parametres.une_contrainte();
	     //alert(lec);
       //$(this).prepend(lec); 
      var self = $(this);
      if(opts.id !== null && parseInt(opts.id)>0) {
        $.get('/' + opts.resource + '/getOneById/' + opts.id,{}, function(datas){
            var lec = "<table id='fiche' data-entite='"+ opts.resource + "' data-id='" + opts.id + "'>";
            for (var fld in datas.data){
              if (typeof opts.fields[fld] !== 'undefined') {

                lec += "<tr><td>" + opts.fields[fld] + "</td><td><input type='text' id='" + fld + "' value='" + datas.data[fld] + "'></td></tr>";

              }
            }
            lec += "</table>";
            self.html(lec); 
            specificite(datas);

            self.dialog({
              title: "La Modale",
              resizable: true,
              height:500,
              width:400,
              modal: true,
              buttons: {
                "Save": function() {
                  var obj = {};
                  for (var fld in opts.fields) {
                     obj[fld] = $('#' + fld).val();
                  }
                  obj["id"] = $("#fiche").data('id');
                  console.log(obj);
                  $.post('/' + opts.resource + '/update',{'datas':obj}, function(result){
                   var msg="";
                   var msg_type ="";
                   if(result.err != null) {
                      msg = "Erreur lors de l'enregistrement";
                      msg_type="error";
                    } else {
                      msg = "Modifications enregistrées";
                      msg_type="success";
                    }
                    for (var fld in opts.fields) {
                      obj[fld] = '';
                    }
                    self.dialog("close");
                    var infos = new PNotify({
                      title: 'Modification ' + opts.resource,
                      text: msg,
                      type: msg_type,
                      desktop: {
                        desktop: true
                      }
                    }); 
                    window.location.href = '/' + opts.resource;
                  });

                 
                },
                Cancel: function() {
                  $(this).dialog("close");
                }
              }
            });
            
        });
    }
    if(opts.id !== null && opts.id == 'N') {
    
      var lec = "<table id='fiche' data-entite='"+ opts.resource + "' data-id='" + opts.id + "'>";
      for (var fld in opts.fields){
        if (typeof opts.fields[fld] !== 'undefined') {

          lec += "<tr><td>" + opts.fields[fld] + "</td><td><input type='text' id='" + fld + "' value=''></td></tr>";

        }
      }
      lec += "</table>";
      
      self.html(lec); 
      specificite({});
      self.dialog({
        title: "La Modale",
        resizable: true,
        height:500,
        width:400,
        modal: true,
        buttons: {
          "Save": function() {
             // Nouveau
             var obj = {};
             for (var fld in opts.fields) {
                obj[fld] = $('#' + fld).val();
             }
             alert(JSON.stringify(obj));
             $.post('/' + opts.resource + '/add',{'datas':obj}, function(result){
                var msg="";
                var msg_type ="";
                if(result.err != null) {
                      msg = "Erreur lors de l'enregistrement";
                      msg_type="error";
                } else {
                      msg = "OK";
                      msg_type="success";
                }
                for (var fld in opts.fields) {
                  obj[fld] = '';
                }
                var infos = new PNotify({
                    title: 'Enregistrement ' + opts.resource,
                    text: msg,
                    type: msg_type,
                    desktop: {
                      desktop: true
                    }

                }); 
                window.location.href = '/' + opts.resource;
                self.dialog("close");
             });

          },
          Cancel: function() {
            self.dialog("close");
          }
        }
      });
    }
       /*
      
$( "#generation" ).dialog({
    title: "Génération système 25",
      resizable: true,
      height:440,
      width:800,
      modal: true,
      buttons: {
        "Ok": function() {
         

        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });

      


       */



    };
})(jQuery);
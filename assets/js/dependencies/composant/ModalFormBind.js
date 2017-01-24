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

        //var tt1 = ht +( (txCom*ht)/100 );
        var tt1 = ht / (1 - (txCom/100));
        var resultat = tt1 + ((tt1*tva)/100);
       
        return Math.round(resultat *100)/100;
      }
      function calculHT(ttc_achat,tva) {
        var resultat = parseFloat(ttc_achat) /(1 + (parseFloat(tva)/100) );
        return Math.round(resultat *100)/100;
      }
      //afichage des types produits
      function afficheType(selectedType) {
         //remplacement id_type text par un object select
          
          var selectProduits = "<select id='id_type'>"; 
          $.get('/produits/getTypes/',{}, function(datas){
            
            if(datas.err == null) {
              var types = datas.data;
              for (var cc = 0; cc < types.length; cc++) {
                var attrS ="";
                if(selectedType == types[cc].id) attrS = "selected"; 
                selectProduits += "<option value='" + types[cc].id + "' " + attrS + " >" + types[cc].nom + "</option>";
              }
              selectProduits += "</select>";
            }
            $("#callbackFill").append(selectProduits);
            return selectProduits;
          });
          
          
      }
      function afficheFournisseur(selectedFournisseur) {
         //remplacement id_type text par un object select
          
          var selectFournisseurs = "<select id='id_fournisseur'>"; 
          $.get('/fournisseurs/getFournisseurs/',{}, function(datas){
            
            if(datas.err == null) {
              var frn = datas.data;
              for (var cc = 0; cc < frn.length; cc++) {
                var attrS ="";
                if(selectedFournisseur == frn[cc].id) attrS = "selected"; 
                selectFournisseurs += "<option value='" + frn[cc].id + "' " + attrS + " >" + frn[cc].nom + "</option>";
              }
              selectFournisseurs += "</select>";
            }
            $("#callbackFillFourn").append(selectFournisseurs);
            return selectFournisseurs;
          });
          
          
      }
      function afficheCiv(civ) {
        var sl = "<select id='civ'>";
        if (civ == 'Mr')
          sl += "<option value='Mr' selected>Mr</option><option value='Mlle'>Mlle</option><option value='Mme'>Mme</option>";
        else
            if (civ == 'Mlle')
              sl += "<option value='Mr'>Mr</option><option value='Mlle' selected>Mlle</option><option value='Mme'>Mme</option>";
            else 
              if (civ == 'Mme')
                sl += "<option value='Mr' >Mr</option><option value='Mlle'>Mlle</option><option value='Mme'selected>Mme</option>";
              else
                sl += "<option value='Mr' >Mr</option><option value='Mlle'>Mlle</option><option value='Mme'>Mme</option>";                
        sl +="</select>";        
        return sl;
      }

      //gestion des cas particuliers
      function specificite(datas) {
        if(opts.resource == 'clients') {
          $("#adresse").addClass('adresse');
          $("#email").addClass('email');
        }

        if(opts.resource == 'fournisseurs') {
          $("#adresse1").addClass('adresse');
          $("#adresse2").addClass('adresse');
          $("#email").addClass('email');
        }

        if(opts.resource == 'produits') {
         
          $("#ttc_vente").attr('disabled','disabled');
          $("#pht").attr('disabled','disabled'); 
          $("#icone").hide();
          $("#disponibilite").hide();

          if(datas.data !== undefined && datas.data !== null) {
            if(datas.data["icone"] !== null && datas.data["icone"] !== undefined)
              var dvIcone = "<img id='imgIcon' class='pictoImg' src='/images/images_rayons/" + datas.data["id_type"] + "/" + datas.data["icone"] + "'>";
            else
              var dvIcone = "<img id='imgIcon' class='pictoImg' src='/images/no_image.png'>";
          } else
              var dvIcone = "<img id='imgIcon' class='pictoImg' src='/images/no_image.png'>";

         
          var btnImg = "<input id='icon' type='file' name='icone' style='display:none'>";
          btnImg += "<input type='button' id='chImg' value='...'>";
          $("#icone").after(dvIcone + btnImg);
          var currentDispo = "";
          var newClass = "";

          if(datas.data !== undefined && datas.data !== null) {
            if(datas.data["disponibilite"] <= 0 || datas.data["disponibilite"] == null || datas.data["disponibilite"] == "null") {
              currentDispo = 0;
              var dvDispo = "<div id='dvDispo' class='indisponible margetop'>indisponible</div>";
            } else {
              currentDispo = 1;
              var dvDispo = "<div id='dvDispo' class='disponible margetop'>disponible</div>";
            }
          } else {
              currentDispo = 1;
              var dvDispo = "<div id='dvDispo' class='disponible margetop'>disponible</div>";
          }

          $("#disponibilite").after(dvDispo);


          $("#chImg").click (function() {
            $("#icon").click();
          });

          $("#dvDispo").click (function() {
             
              if(currentDispo <= 0) {
                newClass = "disponible"; 
                $("#disponibilite").val("1");
              }
              else {
                newClass = "indisponible";
                $("#disponibilite").val("0");
              }

              $("#dvDispo").html(newClass);
              console.log("futur dispo=",newClass);
              $(this).removeClass("indisponible").removeClass("disponible").addClass(newClass);
              currentDispo = $("#disponibilite").val();
              
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
      //Fin de section des cas particuliers
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
                if(fld == 'id_fournisseur') {
                  afficheFournisseur(datas.data['id_fournisseur']);
                  lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td id='callbackFillFourn'></td></tr>";
                } else 
                  if(fld == 'id_type') {
                    afficheType(datas.data['id_type']);
                    lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td id='callbackFill'></td></tr>";
                  } else
                      if(fld == 'civ') {
                         lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td>" + afficheCiv(datas.data[fld]) + "</td></tr>";
                      } else
                          lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td><input type='text' id='" + fld + "' value='" + datas.data[fld] + "'></td></tr>";

              }
            }
            lec += "</table>";
            self.html(lec); 
            specificite(datas);
            var frmWidth = "";
            var frmHeight = "";
            if(opts.width !== undefined && opts.width !== null)
              frmWidth = opts.width;
            else
              frmWidth = 450;

            if(opts.height !== undefined && opts.height !== null) 
              frmHeight = opts.height;
            else
              frmHeight = 520;
            var title = "";
            if(opts.title !== null && opts.title !== undefined)
              title = opts.title;
            else
              title = "Fiche";
            
            self.dialog({
              title: title,
              resizable: true,
              height: frmHeight,
              width: frmWidth,
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
           if(fld == 'id_fournisseur') {
                  afficheFournisseur("--");
                  lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td id='callbackFillFourn'></td></tr>";
                } else 
                  if(fld == 'id_type') {
                    afficheType("--");
                    lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td id='callbackFill'></td></tr>";
                  } else
                    if(fld == 'civ') {
                        lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td>" + afficheCiv('') + "</td></tr>";
                    } else
                        lec += "<tr><td class='alignLabel'>" + opts.fields[fld] + "</td><td><input type='text' id='" + fld + "' value=''></td></tr>";

        }
      }
      lec += "</table>";
      
      self.html(lec); 
      //Check des cas particuliers/tables resources
      specificite({});
      self.dialog({
        title: "La Modale",
        resizable: true,
        height:500,
        width:450,
        modal: true,
        buttons: {
          "Save": function() {
             // Nouveau
             var obj = {};
             for (var fld in opts.fields) {
                obj[fld] = $('#' + fld).val();
             }
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
      

    };
})(jQuery);
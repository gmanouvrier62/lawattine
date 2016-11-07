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
     //atteignable par parametres.curenIdx, etc...
      var defauts = {
          'fields': [],
          'resource': '',
          'externalFields': [],
          'parentId': $(this).attr('id'),
          'une_contrainte': function () {
              return "ok";               
           }
      };

      var parametres = $.extend(defauts, opts);     
      //panel arrondi
      $(this).attr("style","float:left; margin-top: 30px;margin-bottom:3px; width:280px;padding: 10px 20px 20px; line-height: 1; color:#fff; -moz-border-radius: 30px; -webkit-border-radius: 30px; border-radius: 30px; background:linear-gradient(to top,#ED283F,#ED7171)");
       //var lec = parametres.une_contrainte();
	     //alert(lec);
       //$(this).prepend(lec); 
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
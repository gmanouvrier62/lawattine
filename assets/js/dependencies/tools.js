function impression(content){
    var fen = window.open("", "", "height=500, width=600,toolbar=0, menubar=0, scrollbars=1, resizable=1,status=0, location=0, left=10, top=10");
     
    // style du popup
    fen.document.body.style.color = '#000000';
    fen.document.body.style.backgroundColor = '#FFFFFF';
    fen.document.body.style.padding = "20px";
     
    // Ajout des données a imprimer
    fen.document.title = "ACHATS";
    fen.document.body.innerHTML += " " + content + " ";
     
    // Impression du popup
    fen.window.print();
     
    //Fermeture du popup
    fen.window.close();
    return true;
    

}
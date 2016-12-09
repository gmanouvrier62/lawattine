$.prototype.setCommandeTable = function(l_table,id) {


	var cmd = $(this).DataTable({
		'columnDefs': [
			{ "visible": false,  "targets": [ 0] }
        	],
          'oLanguage': {"sZeroRecords": "", "sEmptyTable": ""},
          'processing': false,
          'serverSide': false,
	      'searching': false,
	      'paging': true,
	      'bInfo': false,
	      "dataset": [],
	       "columns": [
	        { title: "Id" },
            { title: "Rayon" },
            { title: "Ref" },
            { title: "img" },
            { title: "Designation" },
            { title: "Qté" },
            { title: "P.U" },
            { title: "TTC" }
        ] 
	});

	return cmd;


}
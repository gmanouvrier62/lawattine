$.prototype.setCommandeTable = function(l_table,id) {


	var cmd = $(this).DataTable({
		'columnDefs': [
			{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html =  row[1];
	                                        
	                    return html;
	            },
	               "targets": 1
        	},
        	{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html =  row[2];
	                                        
	                    return html;
	            },
	               "targets": 2
        	},
        	{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html = "<img class='pictoImg' src='" + row[3] + "'>" + row[4];
	                                        
	                    return html;
	            },
	               "targets": 3
        	},
        	{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html = row[5];
	                                        
	                    return html;
	            },
	               "targets": 4
        	},
        	{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html = row[6];
	                                        
	                    return html;
	            },
	               "targets": 5
        	},
        	{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html = row[7];
	                                        
	                    return html;
	            },
	               "targets": 6
        	},
        	{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html = "bitonio";
	                                        
	                    return html;
	            },
	               "targets": 7
        	},
        	{ "visible": false,  "targets": [ 0 ] }
        	],
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
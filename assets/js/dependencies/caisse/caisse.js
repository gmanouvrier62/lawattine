$.prototype.setDataTable = function(l_table,id) {
	var ajaxUrl ='';
	if(id>0) ajaxUrl = '/' + l_table + '/getAll/' + id;
	var lTable = $(this).DataTable({
		"columnDefs": [
			{
				// The `data` parameter refers to the data for the cell (defined by the
	            // `data` option, which defaults to the column being worked with, in
	            // this case `data: 0`.
	            "render": function ( data, type, row ) {
	                    var html = "<img class='pictoImg' src='/images/images_rayons/" + row[2] + "/" + row[10]  + "'>";
	                                        
	                    return html;
	            },
	               "targets": 1
        	},
        	{
	            "render": function ( data, type, row ) {
	            	var html = "<ul class='infosLi'><li class='designation'>" + row[1] + "</li><li class='liitgr'>" + row[9] + " €</li></ul>";
	                    return html;
	            },
	               "targets": 2
            },
            {
	            "render": function ( data, type, row ) {
	            	var html = '<button class="btn btn-primary btn-xs btn-action action-add" style="font-size: 13px;" title="plus" data-id="' + row[0] + '">+</button>';
	                	html += '<button class="btn btn-primary btn-xs btn-action action-min" style="font-size: 13px;margin-left:5px" title="moins" data-id="' + row[0] + '">-</button>';
	                    html += '<font id="pr_qte" class="fontQte">1</font>';
	                    var blDatas = '" data-id="' + row[0] + '"' + ' data-rayon="' + row[2] + '"' + ' data-ref="' + row[3] + '"';
	                    html += '<button class="btn btn-success btn-xs btn-action action-okpr" style="font-size: 13px;" title="valider" ' + blDatas + '><i class="fa fa-thumbs-o-up"></i></button>';
	                    return html;
	            },
	              "targets": 3
	        },
            { "visible": false,  "targets": [ 0 ] }



		],
		"processing": false,
        "serverSide": false,
        "paging": true,
        "ordering": true,
        "defaultOrdering": [[2, 'desc']],
        "searching": true,
        "search": {
            "smart": false
        },
        "ajax": ajaxUrl

	});
	
	return lTable;
}

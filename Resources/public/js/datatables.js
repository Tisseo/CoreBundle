define(['jquery', 'core/moment', 'core/textfill', 'datatables'], function($, moment) {

    //plugin for ignoring special characters when searching
    $.fn.DataTable.ext.type.search.string = function ( data ) {
        return ! data ?
            '' :
            typeof data === 'string' ?
                data
                    .replace( /έ/g, 'ε')
                    .replace( /ύ/g, 'υ')
                    .replace( /ό/g, 'ο')
                    .replace( /ώ/g, 'ω')
                    .replace( /ά/g, 'α')
                    .replace( /ί/g, 'ι')
                    .replace( /ή/g, 'η')
                    .replace( /\n/g, ' ' )
                    .replace( /[áÁ]/g, 'a' )
                    .replace( /[éÉ]/g, 'e' )
                    .replace( /[íÍ]/g, 'i' )
                    .replace( /[óÓ]/g, 'o' )
                    .replace( /[úÚ]/g, 'u' )
                    .replace( /ê/g, 'e' )
                    .replace( /î/g, 'i' )
                    .replace( /ô/g, 'o' )
                    .replace( /è/g, 'e' )
                    .replace( /ï/g, 'i' )
                    .replace( /ü/g, 'u' )
                    .replace( /ã/g, 'a' )
                    .replace( /õ/g, 'o' )
                    .replace( /ç/g, 'c' )
                    .replace( /ì/g, 'i' ) :
                data;
    };

    $.fn.dataTable.moment = function ( format, locale ) {
        var types = $.fn.dataTable.ext.type;

        // Add type detection
        types.detect.unshift( function ( d ) {

            // Null and empty values are acceptable
            if ( d === '' || d === null ) {
                return 'moment-'+format;
            }

            return moment( d, format, locale, true ).isValid() ?
            'moment-'+format :
                null;
        } );

        // Add sorting method - use an integer for the sorting
        types.order[ 'moment-'+format+'-pre' ] = function ( d ) {
            return d === '' || d === null ?
                Infinity :
                parseInt( moment( d, format, locale, true ).format( 'x' ), 10 );
        };
    };

    datatable = function(params) {
        var defaultParams = {
            "aaSorting": [],
            "bPaginate": false,
            "margin": 0,
            "iDisplayLength" : 100,
            "processing": false,
            "serverSide": false,
            "bFilter": true,
            "search": {
                "caseInsensitive": true
            },
            "searchDelay": 750,
            "createdRow": function(row, data) {
                $(row).find(".line-small").textfill({
                    minFontPixels: 2,
                    maxFontPixels: 15
                });
            },
            "aoColumnDefs" : [
                {
                    "bSortable" : false,
                    "aTargets" : [ "no-sort" ]
                },
                {
                    "bSearchable" : false,
                    "aTargets": [ "no-search" ]
                }
            ],
            "language": {
                "sProcessing":     "Traitement en cours...",
                "sSearch":         "Rechercher&nbsp;:",
                "sLengthMenu":     "Afficher _MENU_ &eacute;l&eacute;ments",
                "sInfo":           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
                "sInfoEmpty":      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
                "sInfoFiltered":   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
                "sInfoPostFix":    "",
                "sLoadingRecords": "Chargement en cours...",
                "sZeroRecords":    "Aucun &eacute;l&eacute;ment &agrave; afficher",
                "sEmptyTable":     "Aucune donn&eacute;e disponible dans le tableau",
                "oPaginate": {
                    "sFirst":      "Premier",
                    "sPrevious":   "Pr&eacute;c&eacute;dent",
                    "sNext":       "Suivant",
                    "sLast":       "Dernier"
                },
                "oAria": {
                    "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
                    "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"
                }
            },
            "fnDrawCallback": function() {
                if (this.fnSettings().fnRecordsTotal() > 10)  {
                    $(this).parent().find('.dataTables_paginate').css("display", "block");
                    $(this).parent().find('.dataTables_length').css("display", "block");
                    $(this).parent().find('.dataTables_filter').css("display", "block");
                    $(this).parent().find('.dataTables_info').css("display", "block");
                } else {
                    $(this).parent().find('.dataTables_paginate').css("display", "none");
                    $(this).parent().find('.dataTables_length').css("display", "none");
                    //$(this).parent().find('.dataTables_filter').css("display", "none");
                    $(this).parent().find('.dataTables_info').css("display", "none");
                }
            }
        };

        var finalParams = $.extend({}, defaultParams, params);
        datatables = [];

        $(document).ready(function() {
            $.fn.dataTable.moment( 'DD/MM/YYYY - HH:mm' );
            $.fn.dataTable.moment( 'DD/MM/YYYY' );

            $(".datatable").each(function(index) {
                var datatable = $(this).DataTable(finalParams);
                datatables[index] = datatable;
            });

            if (finalParams.margin) {
                $('.datatable').parent().css('margin-bottom', (finalParams.margin + 'px'));
            }

            var searchDelay = null;
            $('div.dataTables_filter input').off('keyup.DT input.DT');
            $('div.dataTables_filter input').on('keyup', function() {
                var search = $(this).val();

                datatable_index = parseInt($(this).parents('div.dataTables_filter').attr('id').replace(/^\D+/g, ''));
                if (isNaN(datatable_index) && datatables.length == 1){
                    datatable_index = 0;
                }

                clearTimeout(searchDelay);
                searchDelay = setTimeout(function() {
                    if (search !== null) {
                        datatables[datatable_index].search($.fn.DataTable.ext.type.search.string(search)).draw();
                    }
                }, 750);
            });
        });
    };
});

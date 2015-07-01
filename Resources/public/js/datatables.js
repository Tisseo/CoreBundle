define(['jquery', 'core/textfill', 'datatables'], function($) {
    datatable = function(paginate, margin) {
        datatables = [];
        $(document).ready(function() {
            $(".datatable").each(function(index) {
                var datatable = $(this).DataTable({
                    "aaSorting": [],
                    "bPaginate": paginate,
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
                            $(this).parent().find('.dataTables_filter').css("display", "none");
                            $(this).parent().find('.dataTables_info').css("display", "none");
                        }
                    }
                });
                datatables[index] = datatable;
            });
            if (margin)
                $('.datatable').parent().css('margin-bottom', margin+'px');
        });
    };
});

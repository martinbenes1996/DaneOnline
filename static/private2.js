

(function($){

    function fullTime(name, income, withhold, insurance) {
        name.show();
        income.show();
        withhold.show();
        insurance.show();
    }

    function partTime(name, income, withhold, insurance) {
        name.show();
        income.show();
        //withhold.show();
        insurance.show();
    }

    $("#income_partTime").click(function(){
        name.show();
    });

    $("#checkTaxDeclaration").click(function(){
        evalCheckShow($(this), $("#taxDeclarationInfo"));
        $("#inputWithhold").prop("disabled", $(this).prop("checked"));
    });

    $( document ).ready(function() {
        console.log( "ready!" );
    });





})(jQuery); 


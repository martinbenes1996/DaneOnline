
(function($){
    $.datepicker.regional['cs'] = { 
        closeText: 'Cerrar', 
        prevText: 'Předchozí', 
        nextText: 'Další', 
        currentText: 'Hoy', 
        monthNames: ['Leden','Únor','Březen','Duben','Květen','Červen', 'Červenec','Srpen','Září','Říjen','Listopad','Prosinec'],
        monthNamesShort: ['Le','Ún','Bř','Du','Kv','Čn', 'Čc','Sr','Zá','Ří','Li','Pr'], 
        dayNames: ['Neděle','Pondělí','Úterý','Středa','Čtvrtek','Pátek','Sobota'], 
        dayNamesShort: ['Ne','Po','Út','St','Čt','Pá','So',], 
        dayNamesMin: ['Ne','Po','Út','St','Čt','Pá','So'], 
        weekHeader: 'Sm', 
        dateFormat: 'dd.mm.yy', 
        firstDay: 1, 
        isRTL: false, 
        showMonthAfterYear: false, 
        yearSuffix: ''
    }; 


    $.datepicker.setDefaults($.datepicker.regional['cs']);


})(jQuery); 

function evalCheckShow(indicator, body) {
    if(indicator.prop("checked")) { body.show(); }
    else { body.hide(); }
}

function evalCheckHide(indicator, body) {
    if(indicator.prop("checked")) { body.hide(); }
    else { body.show(); }
}

function createDateRangeInput(fromItem, toItem) {
    fromItem.datepicker({
        minDate: new Date(2018, 0, 1),
        maxDate: new Date(2018, 11, 31),
        defaultDate: new Date(2018, 0, 1),
        changeMonth: true,
        numberOfMonths: 1,
        onSelect: function (selectedDate) {
            $('#ui-datepicker-div table td a').attr('href', 'javascript:;');
            // other code
        }
    })
    .on( "change", function() {
        to.datepicker( "option", "minDate", getDate( this ) );
    });
    toItem.datepicker({
        minDate: new Date(2018, 0, 1),
        maxDate: new Date(2018, 11, 31),
        defaultDate: new Date(2018, 11, 31),
        changeMonth: true,
        numberOfMonths: 1,
        onSelect: function (selectedDate) {
            $('#ui-datepicker-div table td a').attr('href', 'javascript:;');
            // other code
        }
    })
    .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
    });
    fromItem.datepicker('setDate', new Date(2018, 0, 1) );
    toItem.datepicker( 'setDate', new Date(2018, 11, 31) );
    function getDate( element ) {
        var date;
        try {
            date = $.datepicker.parseDate( "dd.mm.yy", element.value );
        } catch( error ) {
            date = null;
        }
 
        return date;
    }
}

function inputClear ( element ) {
    element.removeClass("tax_input_error");
    element.removeClass("tax_input_ok");
}
function inputError ( element ) {
    inputClear( element );
    element.addClass("tax_input_error");
}

function inputOk ( element ) {
    inputClear( element );
    element.addClass("tax_input_ok");
}

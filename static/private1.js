
(function($){
    function checkID() {
        if( $("#inputID").val() == "") {
            inputClear( $('#inputID') );
            return;
        }


        $(".id_loading").show();

       

        inputClear( $('#inputID') );

        // parse
        var id_s = $('#inputID').val().replace(/ /g,'');

        if(id_s.length == 11 && id_s[6] == '/') {
            id_s = id_s.slice(0,6).concat(id_s.slice(7));
        }
        var id = parseInt(id_s);

        // numeric
        if ( !$.isNumeric(id) ) {
            console.log("Not number!");
            inputError( $('#inputID') );
            $(".id_loading").hide();
            return;
        // dividable by 11
        } else if ((id % 11) != 0) {
            console.log("ID not dividable by 11!");
            inputError( $('#inputID') );
            $(".id_loading").hide();
            return;
        // 9 or 10 digits
        } else if(id < 100000000 || id > 9999999999) {
            console.log("Bad length of ID!");
            inputError( $('#inputID') );
            $(".id_loading").hide();
            return;
        }

        var y = parseInt(id_s.slice(0,2));
        var m = parseInt(id_s.slice(2,4));
        var d = parseInt(id_s.slice(4,6));
        
        var mm = 0;
        if (m>=51 && m<=62) { mm = m - 50; }
        else if (m>=71 && m<=82) { mm = m - 70; }
        else if (m>=21 && m<=32) { mm = m - 20; }
        else { mm = m; }

        // valid year
        if (y > 19 && y < 54) {
            console.log("Invalid year!");
            inputError( $('#inputID') );
            $(".id_loading").hide();
            return;
        // valid month
        } else if ( ! (
            (m>=1 && m<=12) 
            || (m>=51 && m<=62) 
            || (m>=21 && m<=32) 
            || (m>=71 && m<=82)
            ) 
        ) {
            console.log("Invalid month!");
            inputError( $('#inputID') );
            $(".id_loading").hide();
            return;
        // valid day
        } else if ( ! (d>=1 && (
            ( (mm==1 || mm==3 || mm==5 || mm==7 || mm==8 || mm==10 || mm==12) && d<=31 )
            || ( (mm==4 || mm==6 || mm==9 || mm==11) && d<=30 )
            || ( mm==2 && ( ((y%4)!=0 && d<=28) || ((y % 4)==0 && d<=29) ) )
            )
        )) {
            console.log("Invalid day!");
            inputError( $('#inputID') );
            $(".id_loading").hide();
            return;

        } else {
            // woman
            if ( (m>=51 && m<=62) || (m>=71 && m<=82) ) {
                $("#labelStudent").text("Studentka");
                $("#labelRetired").text("Důchodkyně");
                $("#labelMarried").text("Vdaná");
                $("#labelChild").text("Matka");
                $("#labelDonor").text("Dárkyně krve");
                $(".femaleSuffix_a").text("a");
                $(".femaleSuffix_ka").text("ka");
                if ( $("#donorCount5").prop("checked") ) {
                    alert("Žena nemůže darovat krev 5x za rok!");
                }
                $("#donorCount5").prop("disabled", true);

            // man
            } else {
                $("#labelStudent").text("Student");
                $("#labelRetired").text("Důchodce");
                $("#labelMarried").text("Ženatý");
                $("#labelChild").text("Otec");
                $("#labelDonor").text("Dárce krve");
                $(".femaleSuffix_a").text("");
                $(".femaleSuffix_ka").text("");
                $("#donorCount5").prop("disabled", false);
            }

            setTimeout(
                function() {
                    $(".id_loading").hide();
                    inputOk( $('#inputID') );
                }, 500);

            
        }
    }

    function setLocation(cityCode) {
        
        $(".city_loading").show();
        $.ajax({
            url: "/address/getLocation/" + cityCode,
            dataType: "json",
            success: function(data) {
                $(".city_loading").hide();
                $("#inputCity").prop("placeholder", data['name']);
                $("#inputRegion").prop("placeholder", data['region']);
                inputOk( $("#inputZip") );
            },
            error: function(xhr, status, error) {
                $(".city_loading").hide();
                console.log("Error: setLocation");
                inputError( $("#inputZip") );
            }
        });
    }

    $("#inputName").blur(function(){ inputOk_notEmpty($(this)); });
    $("#inputSurname").blur(function(){ inputOk_notEmpty($(this)); });
    $("#inputSurname2").blur(function(){ inputOk_notEmpty($(this)); });
    $('#inputID').blur(function() { checkID(); });
    $("#inputEmail").blur(function(){ checkEmail(); });
    $("#inputPhone").blur(function(){ checkPhone(); });

    function checkName() {
        inputOk_notEmpty( $("#inputName") );
        inputOk_notEmpty( $("#inputSurname") );
        inputOk_notEmpty( $("#inputSurname2") );
        checkID();
    }

    function checkLocation() {
        cityCode = $("#inputZip").val();
        if( cityCode == "") { return; }
        else if ( !$.isNumeric( parseInt(cityCode) ) ) { 
            inputError( $("#inputZip") );
            return;
        }
        else if ( parseInt(cityCode) < 10000 || parseInt(cityCode) > 99999 ) {
            inputError( $("#inputZip") );
            return;
        }

        setLocation(cityCode);
    }


    function checkAddress() {
        // empty address
        if( $("#inputStreet").val() == "" ) { return; }
        else if( $("#inputHouseNumber").val() == "" ) { return; }
        else if( $("#inputZip").val() == "" ) { return; }
        // invalid zip
        else if( ! $.isNumeric( parseInt($("#inputZip").val()) ) ) {
            inputError( $("#inputZip") );
        }
        // ok
        else {
            $(".address_loading").show();
            // check
            $.ajax({
                url: "/address/check/" + $("#inputZip").val() + "/" + $("#inputStreet").val() + "/" + $("#inputHouseNumber").val(),
                dataType: "text",
                // ok
                success: function(data) {
                    $(".address_loading").hide();
                    inputOk( $("#inputStreet") );
                    inputOk( $("#inputHouseNumber") );
                },
                // error
                error: function(xhr, status, error) {
                    $(".address_loading").hide();
                    inputError( $("#inputStreet") );
                    inputError( $("#inputHouseNumber") );
                }
            });
        }
    }

    function checkEmail() {
        // parse email
        email = $("#inputEmail").val();

        // empty
        if( email == "" ) { 
            inputClear( $('#inputEmail') );
            return;
        }

        $(".email_loading").show();
        // check email
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if( !regex.test(email) ) {
            setTimeout(function() {
                $(".email_loading").hide();
                inputError( $("#inputEmail") );
            }, 500);
            return;
        }
        // ok
        setTimeout(function() {
            $(".email_loading").hide();
            inputOk( $("#inputEmail") );
        }, 500);
    }

    function checkPhone() {
        // parse phone
        phone = $("#inputPhone").val();

        // empty phone
        if( phone == "" ) {
            $(".phone_loading").hide();
            inputClear( $("#inputPhone") );
            return;
        }

        $(".phone_loading").show();
        // clear spaces
        var phone_cl = phone.replace(/ /g,'');
        // check phone
        var phone_regex = /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/;
        if( !phone_regex.test(phone_cl) ) {
            setTimeout(function() {
                $(".phone_loading").hide();
                inputError( $("#inputPhone") );
            }, 500);
            return;
        }
        // format phone
        var phone_out;
        if( phone_cl.slice(0,1) == "+" ) {
            phone_out = phone_cl.slice(0,4) + " " + phone_cl.slice(4,7) + " " + phone_cl.slice(7,10) + " " + phone_cl.slice(10,13);
        } else {
            phone_out = "+420 " + phone_cl.slice(0,3) + " " + phone_cl.slice(3,6) + " " + phone_cl.slice(6,9)
        }
        // ok
        setTimeout(function() {
            $("#inputPhone").val(phone_out);
            $(".phone_loading").hide();
            inputOk( $("#inputPhone") );
        }, 500);
    }

    function inputOk_notEmpty(element) {
        if(element.val() != "") { inputOk( element );}
        else { inputClear( element ); }
    }

    var childCnt = 0;
    function addChild() {
        childCnt += 1;
        var childIndex = childCnt;
        //if ( childIndex == 1 ) { $("#inputChild").prop("checked", true); }

        $("<div>").addClass("form-row tax_child").prop("id", "child"+childIndex).append(
            $("<div>").addClass("form-check col-md-2").append(
                $("<b>").text(""+childIndex+". dítě")
            )
        ).append(
            $("<div>").addClass("form-check col-md-4").append(
                $("<input>").addClass("form-check-input")
                    .prop("type", "checkbox")
                    .prop("id", "inputChild"+childIndex+"Kindergarden")
                    .click(function(){ evalCheckShow($("#inputChild"+childIndex+"Kindergarden"), $("#child"+childIndex+"KindergardenInfo")); })
            ).append(
                $("<label>").addClass("form-check-label")
                    .prop("for", "inputChild"+childIndex+"Kindergarden")
                    .text("Navštěvovalo školku")
            ).append(
                $("<div>").addClass("form-group").css("display", "none").prop("id", "child"+childIndex+"KindergardenInfo").append(
                    $("<input>").addClass("form-check-input")
                        .prop("type", "checkbox")
                        .prop("checked", true)
                        .prop("id", "inputChild"+childIndex+"KindergardenWholeYear")
                ).append(
                    $("<label>").addClass("form-check-label")
                        .prop("for", "inputChild"+childIndex+"DisabledWholeYear")
                        .text("Celý rok")
                    )
            )
        ).append(
            $("<div>").addClass("form-check col-md-4").append(
                $("<input>").addClass("form-check-input")
                    .prop("type", "checkbox")
                    .prop("id", "inputChild"+childIndex+"Disabled")
                    .click(function(){ evalCheckShow($("#inputChild"+childIndex+"Disabled"), $("#child"+childIndex+"DisabledInfo")); })
            ).append(
                $("<label>").addClass("form-check-label")
                    .prop("for", "inputChild"+childIndex+"Disabled")
                    .text("Držitel ZTP/P")
            ).append(
                $("<div>").addClass("form-group").css("display", "none").prop("id", "child"+childIndex+"DisabledInfo").append(
                    $("<input>").addClass("form-check-input")
                        .prop("type", "checkbox")
                        .prop("checked", true)
                        .prop("id", "inputChild"+childIndex+"DisabledWholeYear")
                ).append(
                    $("<label>").addClass("form-check-label")
                        .prop("for", "inputChild"+childIndex+"DisabledWholeYear")
                        .text("Celý rok")
                )
            )
        ).append(
            $("<div>").addClass("form-check col-md-2").append(
                $("<button>").addClass("btn btn-sm tax_button3")
                    .prop("type", "button")
                    .text("Odebrat dítě")
                    .click(childIndex, function(data){ removeChild(data.data); })
            )
        ).insertBefore( $(".child_appender") );
    }

    function remarkChild(el, index) {
        el.prop("id", "child"+index);
        el.find("b").text(""+index+". dítě");
        el.find("input").each(function(i, el){
            var regExp = /inputChild[0-9]+([^0-9]+.*)/;
            var matches = regExp.exec($(el).prop("id"));
            newid = "inputChild"+index+matches[1];
            console.log($(el).prop("id") + " > " + newid);
            $(el).prop("id", newid);
        });
        el.find("label").each(function(i, el){
            var regExp = /inputChild[0-9]+([^0-9]+.*)/;
            var matches = regExp.exec($(el).prop("for"));
            newfor = "inputChild"+index+matches[1];
            console.log($(el).prop("id") + " > " + newfor);
            $(el).prop("for", newid);
        });
        el.find("div").each(function(i, el){
            if($(el).prop("id").slice(-4) == "Info") {
                
                var regExp = /child[0-9]+([^0-9]+.*)/;
                var matches = regExp.exec($(el).prop("id"));
                newid = "child"+index+matches[1];
                console.log($(el).prop("id") + " > " + newid);
                $(el).prop("id", newid);
            }
        });
        el.find("button").unbind("click");
        el.find("button").click(index, function(data){
            removeChild(data.data);
        });
        el.find("input#inputChild"+index+"Kindergarden").click( function(){
            evalCheckShow($("#inputChild"+index+"Kindergarden"), $("#child"+index+"KindergardenInfo"));
        });
        el.find("input#inputChild"+index+"Disabled").click( function(){
            evalCheckShow($("#inputChild"+index+"Disabled"), $("#child"+index+"DisabledInfo"));
        });
    }

    function removeChild(index) {
        if( childCnt == 1 ) {
            $("#inputChild").prop("checked", false);
            $("#childInfo").hide();
            return;
        }
        $("#child"+index).remove(); 
        if(index < childCnt) { 
            $(".tax_child").each(function(it, el) {
                for(var i = index+1; i <= childCnt; i++) {
                    if( $(el).prop("id") == "child"+i) {
                        remarkChild($(el), i-1);
                    }
                }
                
            })
        }
        childCnt -= 1;
        console.log("Removed child " + index);
    }
    
    $(".child_adder").click(function(){ addChild(); });
    $("#inputChild").click(function(){ 
        if( $("#inputChild").prop("checked") ) { $("#childInfo").show(); }
        else { $("#childInfo").hide(); }
    });

    $("#inputSurname").blur(function(){
        if($("#inputSurname2").val() == "") {
            $("#inputSurname2").val($(this).val());
        }
    });

    $("#inputStreet").blur(function(){ checkAddress(); });

    $("#inputHouseNumber").blur(function(){ checkAddress(); });

    $("#inputZip").blur(function() {
        cityCode = parseInt( $(this).val() );
        if( !$.isNumeric(cityCode) ) { 
            inputError( $(this) );
        } else if( cityCode < 10000 || cityCode > 99999 ) {
            inputError( $(this) );
        } else {
            setLocation(cityCode);
            checkAddress();
        }

    });

    $("#inputPartnerEarnedLess68000").click(function(){
        if( ! $("#inputPartnerEarnedLess68000").prop("checked")
            && $("#inputMarried").prop("checked") ) {
            
            $("#inputMarried").prop("checked", false);
            $("#marriedInfo").hide();
            alert("Lze uplatnit pouze při příjmu vyživovaného pod 68000.");
        }
    });


    function evalStudent() {
        evalCheckShow($("#inputStudent"), $("#studentInfo"));
        if($("#inputStudent").prop("checked")) {
            evalCheckHide($("#inputStudentWholeYear"), $("#studentDateRange"));
        }
    }
    function evalRetired() { 
        evalCheckShow($("#inputRetired"), $("#retiredInfo")); 
        if($("#inputRetired").prop("checked")) {
            evalCheckHide($("#inputRetiredWholeYear"), $("#retiredDateRange"))
        }
    }
    function evalInvalid() {
        evalCheckShow($("#inputInvalid"), $("#invalidInfo1"));
        evalCheckShow($("#inputInvalid"), $("#invalidInfo2"));
        if($("#inputInvalid").prop("checked")) {
            evalCheckHide($("#inputInvalidWholeYear"), $("#invalidDateRange"));
        }
    }
    function evalChild() {
        evalCheckShow($("#inputChild"), $("#childInfo"));
    }
    function evalMarried() { 
        evalCheckShow($("#inputMarried"), $("#marriedInfo")); 
        evalCheckShow($("#inputMarriedDisabled"), $("#marriedDisabledInfo")); 
        if($("#inputMarried").prop("checked")) {
            evalCheckHide($("#inputMarriedWholeYear"), $("#marriedDateRange"));
            evalCheckHide($("#inputMarriedDisabledWholeYear"), $("#marriedDisabledDateRange"));
            $("#inputPartnerEarnedLess68000").prop("checked", true);
        }
    }
    function evalDonor() { evalCheckShow($("#inputDonor"), $("#donorInfo")); }
    $("#inputStudent").click(function() { evalStudent(); });
    $("#inputStudentWholeYear").click(function() { evalStudent(); });
    $("#inputRetired").click(function() { evalRetired(); });
    $("#inputRetiredWholeYear").click(function() { evalRetired(); });
    $("#inputInvalid").click(function() { evalInvalid(); });
    $("#inputInvalidWholeYear").click(function() { evalInvalid(); });
    $("#inputMarried").click(function() { evalMarried(); });
    $("#inputMarriedWholeYear").click(function() { evalMarried(); });
    $("#inputMarriedDisabled").click(function() { evalMarried(); });
    $("#inputMarriedDisabledWholeYear").click(function() { evalMarried(); });
    $("#inputDonor").click(function() { evalDonor(); });

    $( document ).ready(function() {
        console.log( "ready!" );
        evalStudent();
        evalRetired();
        evalInvalid();
        evalMarried();
        evalChild();
        evalDonor();

        checkName();
        checkAddress();
        checkLocation();
        checkEmail();
        checkPhone();

        addChild();

        createDateRangeInput($("#inputStudentFrom"), $("#inputStudentTo"));
        createDateRangeInput($("#inputRetiredFrom"), $("#inputRetiredTo"));
        createDateRangeInput($("#inputInvalidFrom"), $("#inputInvalidTo"));
        createDateRangeInput($("#inputMarriedFrom"), $("#inputMarriedTo"));
        createDateRangeInput($("#inputMarriedDisabledFrom"), $("#inputMarriedDisabledTo"));
    });

})(jQuery); 

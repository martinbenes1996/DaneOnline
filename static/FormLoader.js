

class FormLoader extends React.Component {
    connect(event, handler, inputIdList=[this.props.key] ) {
        inputIdList.forEach(function(inputId){
            this.getInputEl( (new FormInput).id(inputId) ).addEventListener(
                event, handler.bind(this)
            );
        }.bind(this));
        
    }
    checkBirthNumber() {
        var el = this.getInputEl();
        var s = el.value;
        // clear format
        el.classList.remove("input_error");
        el.classList.remove("input_ok");
        this.getLoaderEl().style.display = "block";
        // read input
        s = s.replace(/ /g,'');
        if(s.length === 11 && s[6] === '/') s = s.slice(0,6).concat(s.slice(7));
        var rc = parseInt(s);
        if(isNaN(rc)) {
            console.log("Birth number is not a number.");
            this.setError(el, this.getLoaderEl());
            return;
        } else if ((rc % 11) != 0) {
            console.log("Birth number is not dividable by 11.");
            this.setError(el, this.getLoaderEl());
            return;
        } else if (rc < 100000000 || rc > 9999999999) {
            console.log("Birth number has bad length.");
            this.setError(el, this.getLoaderEl());
            return;
        }
        // parse data
        var y = parseInt(s.slice(0,2));
        var m = parseInt(s.slice(2,4));
        var d = parseInt(s.slice(4,6));
        var woman = false; // get gender
        if (m>=51 && m<=62) { woman = true; m -= 50; }
        else if (m>=71 && m<=82) { woman = true; m -= 70; }
        else if (m>=21 && m<=32) { m = m - 20; }
        else { m = m; }
        // validate data
        if (y > 19 && y < 54) {
            console.log("Birth number has invalid year.");
            this.setError(el, this.getLoaderEl());
        // valid month
        } else if (m<1 || m>12) {
            console.log("Birth number has invalid month.");
            this.setError(el, this.getLoaderEl());
        // valid day
        } else if ( ! (d>=1 && (
            ( (m===1 || m===3 || m===5 || m===7 || m===8 || m===10 || m===12) && d<=31 )
            || ( (m===4 || m===6 || m===9 || m===11) && d<=30 )
            || ( m===2 && ( ((y%4)!=0 && d<=28) || ((y % 4)===0 && d<=29) ) )
            )
        )) {
            console.log("Birth number has invalid day.");
            this.setError(el, this.getLoaderEl());
        } else {
            // woman
            if (woman) {
                // change labels
            // man
            } else {
            }

            el.value = el.value.slice(0,6) + "/" + el.value.slice(6);
            this.setOk(el, this.getLoaderEl());
            
            var data = {rc, y, m, d, woman};
            console.log(data);
            return data;
        }
    }
    checkAddress() {
        // initialize
        this.getInputEl("street").classList.remove("input_error");
        this.getInputEl("street").classList.remove("input_ok");
        this.getInputEl("housenumber").classList.remove("input_error");
        this.getInputEl("housenumber").classList.remove("input_ok");
        this.getLoaderEl().style.display = "block";

        var street = this.getInputEl("street").value;
        var housenumber = this.getInputEl("housenumber").value;
        var citycode = this.getInputEl("citycode").value;
        if (street === "" || housenumber === "" || citycode === "") { return; }

        var psc = parseInt(citycode);
        if ( isNaN(psc) ) { console.log("City code is not number."); }
        else if ( psc < 10000 || psc > 99999 ) { console.log("City code has invalid format."); }
        else {
            $.ajax({
                url: "/address/check/" + citycode + "/" + street + "/" + housenumber,
                dataType: "text",
                // ok
                success: function(data) {
                    this.setOk(this.getInputEl("street"), this.getLoaderEl("address"), 0);
                    this.setOk(this.getInputEl("housenumber"), this.getLoaderEl("address"), 0);
                }.bind(this),
                // error
                error: function(xhr, status, error) {
                    this.setError(this.getInputEl("street"), this.getLoaderEl("address"), 0);
                    this.setError(this.getInputEl("housenumber"), this.getLoaderEl("address"), 0);
                }.bind(this)
            })
        }

    }
    checkCityCode() {
        var el = this.getInputEl();
        var s = el.value;
        // initialize
        el.classList.remove("input_error");
        el.classList.remove("input_ok");
        this.getLoaderEl().style.display = "block";
        // check
        var psc = parseInt(s);
        if ( isNaN(psc) ) { console.log("City code is not number."); }
        else if ( psc < 10000 || psc > 99999 ) { console.log("City code has invalid format."); }
        else {
            this.checkAddress();
            $.ajax({
                url: "/address/getLocation/" + s,
                dataType: "json",
                success: function(data) {
                    var cityEl = this.getInputEl("city");
                    cityEl.placeholder = data['name'];
                    var regionEl = this.getInputEl("region");
                    regionEl.placeholder = data['region'];

                    this.setOk(el, this.getLoaderEl(), 0);
                }.bind(this),
                error: function(xhr, status, error) {
                    console.log("Error searching city code.");
                    this.setError(el, this.getLoaderEl(), 0);
                }.bind(this)
            });
        }
        return;

    }
    checkEmail() {
        var el = this.getInputEl();
        var s = el.value;
        // initialize
        el.classList.remove("input_error");
        el.classList.remove("input_ok");
        this.getLoaderEl().style.display = "block";
        // check email
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if( !regex.test(s) ) {
            this.setError(el, this.getLoaderEl());
            return;
        }
        this.setOk(el, this.getLoaderEl());
        
        var data = {s};
        console.log(data);
        return data;
    }
    checkPhone() {
        var el = this.getInputEl();
        var s = el.value;
        if(s === "") {
            this.setError(el, this.getLoaderEl());
            return;
        }
        // initialize
        el.classList.remove("input_error");
        el.classList.remove("input_ok");
        this.getLoaderEl().style.display = "block";

        s = s.replace(/ /g,'');
        var rgx = /^(\+420)? ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$/;
        if( !rgx.test(s) ) {
            this.setError(el, this.getLoaderEl());
            return;
        }
        if( s.slice(0,1) === "+" ) {
            s = s.slice(0,4) + " " + s.slice(4,7) + " " + s.slice(7,10) + " " + s.slice(10,13);
        } else {
            s = "+420 " + s.slice(0,3) + " " + s.slice(3,6) + " " + s.slice(6,9);
        }

        el.value = s
        this.setOk(el, this.getLoaderEl());

        var data = { s };
        console.log(data);
        return data;
    }

    setError(input, loader, timeout=300) {
        setTimeout(function(){ 
            input.classList.add("input_error");
            loader.style.display = "none";
        }, timeout);
    }
    setOk(input, loader, timeout=300) {
        setTimeout(function(){ 
            input.classList.add("input_ok");
            loader.style.display = "none";
        }, timeout);
    }
    getInputEl(key="") {
        if (key === "") { key = this.props.id; }
        var inputId = (new FormInput).id(key);
        return document.getElementById(inputId);
    }
    getLoaderEl(key="") {
        if (key === "") { key = this.props.id; }
        var loaderId = this.id(key);
        return document.getElementById(loaderId);
    }
    render() {
        var inputId = this.id(this.props.id);
        return (
            <FormRow key={inputId} className="loader">
                <strong>{this.props.text}</strong>
                <div className="spinner-border ml-auto" role="status"
                        aria-hidden="true"></div>
            </FormRow>
        );
    }
    id(key) { return key+"_loader"; }
}


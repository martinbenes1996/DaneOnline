
//import { React } from 'react';
//import { FormInput, FormHeader, FormRow } from "FormUI";
//import { FormLoader } from 'FormLoader';

class PrivateForm1 extends React.Component {
    constructor(props) {
        super(props);
        this.name = { first: "", last: "", birth: ""};
    }

    connect() {
        this.birthnumber.connect('blur', this.birthnumber.checkBirthNumber);
        this.address.connect('blur', this.address.checkAddress,
                        ["street", "housenumber"]);
        this.citycode.connect('blur', this.citycode.checkCityCode);
        this.email.connect('blur', this.email.checkEmail);
        this.phone.connect('blur', this.phone.checkPhone);
    }

    render() {
        this.birthnumber = new FormLoader({id: "birthnumber", text: "Ověřuji rodné číslo..."});
        this.address = new FormLoader({id: "address", text: "Ověřuji adresu..."});
        this.citycode = new FormLoader({id: "citycode", text: "Ověřuji PSČ v poštovní databázi..."})
        this.email = new FormLoader({id: "email", text: "Ověřuji emailovou adresu..."});
        this.phone = new FormLoader({id: "phone", text: "Ověřuji mobilní číslo..."});
        return (
            <div className="container tax_form"><form action="/osobni/2">
                <FormHeader header="Jméno"/>
                <FormRow>
                    <FormInput id="name" text="Jméno" placeholder="Jana" />
                    <FormInput id="surname" text="Příjmení" placeholder="Nováková" /> 
                    <FormInput id="surname2" text="Rodné Příjmení" placeholder="Nováková" />
                </FormRow>
                { this.birthnumber.render() }
                <FormRow>
                    <FormInput id="birthnumber" text="Rodné číslo" placeholder="685523/5167" />
                </FormRow>

                <FormHeader header="Adresa" separated/>
                { this.address.render() }
                <FormRow>
                    <FormInput id="street" text="Ulice" width="8"  placeholder="Masarykova"/>
                    <FormInput id="housenumber" text="Číslo popisné" width="4" placeholder="7"/>
                </FormRow>
                { this.citycode.render() }
                <FormRow>
                    <FormInput id="citycode" text="PSČ" width="2" placeholder="60100"/>
                    <FormInput id="city" text="Město" width="6" placeholder="Brno" readonly/>
                    <FormInput id="region" text="kraj" width="4" placeholder="Jihomoravský" readonly/>
                </FormRow>

                <FormHeader text="Kontaktní údaje" separated/>
                { this.email.render() }
                { this.phone.render() }
                <FormRow>
                    <FormInput id="email" text="Email" width="6" placeholder="jana.novakova@seznam.cz"/>
                    <FormInput id="phone" text="Telefon" width="6" placeholder="+420 654 987 321"/>
                </FormRow>

                <FormHeader header="Slevy na dani" separated>
                    Za minulý rok (alespoň část roku) uplatňuji následující slevy
                </FormHeader>
                <FormStatus id="student">Student</FormStatus>
                <FormStatus id="retired">Důchodce</FormStatus>
                <FormStatus id="disabled">Invalida</FormStatus>
                <FormStatus id="married">Ženatý / vdaná</FormStatus>
                <FormStatus id="children">Otec / matka</FormStatus>
                <FormStatus id="blooddonor">Dárce krve</FormStatus>


            </form></div>
        );
    }
}

const privateForm1Item = document.getElementById('PrivateForm1');
var form1 = new PrivateForm1();
ReactDOM.render(form1.render(), privateForm1Item);
form1.connect();



//import { React } from 'react';

class FormInput extends React.Component {
    id(key) { return key+"_input"; }
    render() {
        var id = this.id(this.props.key);
        var classes = "form-group col";
        if (this.props.width) { classes += "-"+this.props.width; }
        var readonly = true; if (!this.props.readonly) { readonly = false; }
        return (
            <div className={classes}>
                <label htmlFor={id}>{this.props.text}</label>
                <input type="text" className="form-control" id={id}
                        placeholder={this.props.placeholder} readOnly={readonly}/>
            </div>
        );
    }
}

class FormRow extends React.Component {
    id(key) { return key+"_row"; }
    el(key) {
        var id = this.id(key);
        return document.getElementById(id);
    }
    render() {
        var classes = "form-row " + this.props.className;
        if ("key" in this.props) {
            return (
                <div className={classes} id={this.id(this.props.key)}>
                    {this.props.children}
                </div>
            );
        } else {
            return (
                <div className={classes}>
                    {this.props.children}
                </div>
            );
        }
        
    }
}

class FormHeader extends React.Component {
    render() {
        var separator, text;
        if (this.props.children) text = <p>{this.props.children}</p>;
        if (this.props.separated) separator = <hr />
        return (<div>{separator}<h4>{this.props.header}</h4>{text}</div>);
    }
}

class FormCheckButton extends React.Component {
    id(key) { return key+"_check"; }
    el(key) {
        var id = this.id(key);
        return document.getElementById(id);
    }
    render() {
        var inverted = false; if( this.props.inverted ) { inverted = true; }
        var id = this.id(this.props.key);
        return (
            <div className={"form-group "+this.props.className}>
                <input className="form-check-input" type="checkbox" value="" id={id} onClick={this.props.onClick}/>
                <label className="form-check-label" htmlFor={id}>{this.props.children}</label>
            </div>
        );
    }
}

class FormDateInput extends React.Component {
    id(key) { return key+"_datein"; }
    render() {
        var id = this.id(this.props.key);
        return (
            <div className={"form-check-inline " + this.props.className}>
                <label htmlFor={id} className="form-check-label">Od&nbsp;&nbsp;</label>
                <input type="text" className="form-control" id={id} name={id}/>
            </div>
        );
    }
}

class FormDateRange extends React.Component {
    id(key) { return key+"_daterangein"; }
    id_from(key) { return key+"_from"; }
    id_to(key) { return key+"_to"; }
    el(key) { return document.getElementById(this.id(key)); }
    change() {
        var state = (new FormCheckButtonOptions).getWholeYearState(this.props.key);
        var el = this.el();
        if(state) { el.style.display = "none"; }
        else { el.style.display = "inline"; }
    }
    render() {
        return (
            <div className={"form-check "+this.props.className} id={this.id(this.props.key)}>
                <FormDateInput key={this.id_from(this.props.key)} className="col-5"/>
                <FormDateInput key={this.id_to(this.props.key)} className="col-5"/>
            </div>
        );
    }
}

class FormCheckButtonOptions extends React.Component {
    id(key) { return key+"_options"; }
    id_year(key) { return key+"_wholeyear"; }
    el() { return (new FormRow).el(this.props.key); }
    getStatusState(key) {
        var el = (new FormCheckButton).el(key);
        return el.checked;
    }
    getYearState(key) {
        var el = document.getElementById(this.id_year(key));
        return el.checked;
    }
    change() {
        var state = this.getStatusState();
        var el = this.el(this.props.key);
        if(state) { el.style.display = "inline"; }
        else { el.style.display = "none"; }
    }
    render() {
        var inverted = false; if( this.props.inverted ) { inverted = true; }
        var key = this.props.key;
        // make id
        var id = this.id(key);
        var year_id = this.id_year(key);
        // generate HTML
        var dateRange = new FormDateRange({key:key, className:"col"})
        return (
            <div className="col-6" id={id}>
                <FormRow className="check_options">
                    <FormCheckButton key={year_id} className="col"
                            onClick={dateRange.change.bind(dateRange)}>
                        Po celý rok
                    </FormCheckButton>
                </FormRow>
                <FormRow className="check_options_daterange">
                    {dateRange.render()}
                </FormRow>
            </div>
        );
    }
}

class FormStatus extends React.Component {
    render() {
        var options = new FormCheckButtonOptions({key: this.props.id})
        return (
            <FormRow>
                <div className="form-check col-1"/>
                <FormCheckButton key={this.props.id} className="col-2"
                        onClick={options.change.bind(options)}>
                    {this.props.children}
                </FormCheckButton>
                {options.render()}
            </FormRow>
        );
    }
}


(function(){
    HtmlGenerator = function()
    {
        this.br = function()
        {
            return this._el("br");
        }

        this.div = function(params)
        {
            var el = this._el("div");
            el = this._addParams(el, params);
            if(params.hasOwnProperty('dataToggle')) el.setAttribute('data-toggle', params.dataToggle);
            return el;
        }
        
        this.span = function(params)
        {
            var el = this._el("span");
            return this._addParams(el, params);
        }
        
        this.i = function(params)
        {
            var el = this._el("i");
            return this._addParams(el, params);
        }
        
        this.h1 = function(params)
        {
            return this._simple("h1", params);
        }
        
        this.h2 = function(params)
        {
            return this._simple("h2", params);
        }
        
        this.h3 = function(params)
        {
            return this._simple("h3", params);
        }

        this.label = function(params)
        {
            var el = this._simple("label", params);
            if(params.hasOwnProperty('for')) el.htmlFor = params.for;
            return el;
        }
        
        this.button = function(params)
        {
            return this._simple("button", params);
        }
        
        this.select = function(params)
        {
            var el = this._simple("select", params);
            if(params.hasOwnProperty('name')) el.name = params.name;
            if(params.hasOwnProperty('options')) 
            {
                if(params.options.length instanceof Array)
                {
                    for(var i = 0; i < params.options.length; i++) 
                    {
                        var subel = this.option(params.options[i])
                        el.appendChild(subel);
                    }
                }
                else
                {
                    for(value in params.options)
                    {
                        var subel = this.option(params.options[value]);
                        el.appendChild(subel);
                    }
                }
            }
            return el;
        }
        
        this.option = function(params)
        {
            var el = this._simple("option", params);
            if(params.hasOwnProperty('value')) el.value = params.value;
            if(params.hasOwnProperty('selected')) el.selected = true;
            return el;
        }
        
        this.input = function(params)
        {
            var el = this._simple("input", params);
            if(params.hasOwnProperty('name')) el.name = params.name;
            if(params.hasOwnProperty('value')) el.value = params.value;
            if(params.hasOwnProperty('type')) el.type = params.type;
            return el;
        }
        
        this.text = function(text)
        {
            return document.createTextNode(text);
        }

        this._el = function(type)
        {
            return document.createElement(type);
        }
        
        this._simple = function(type, params)
        {
            var el = this._el(type);
            if(params.hasOwnProperty('text')) 
            {
                var text = document.createTextNode(params.text);
                el.appendChild(text);
            }
            return this._addParams(el, params);
        }
        
        this._addParams = function(el, params)
        {
            if(params.hasOwnProperty('class')) el.className = params.class;
            if(params.hasOwnProperty('id')) el.id = params.id;
            return el;
        }
    }
})();

function insertAfter(referenceNode, newNode) 
{
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function insertBefore(referenceNode, newNode)
{
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
}
// Class to manage table
export class Dashboard
{
    static clues = ['name', 'username', 'id', 'status'];
    static requiredParameters = ['username', 'password', 'email', 'value', 'name'];

    static transformData(data, type)
    {
        switch (type)
        {
            case "list-objects":
                return this.#transformDataListObjects(data);
            case "object-items":
                return this.#transformDataObjectItems(data);
            case "matrix":
                return data;
            case "item-list":
                return this.#transformDataItemList(data);
        }
    }

    static #transformDataItemList(data)
    {
        const dataConv = Object.values(data)[0];
        return this.#transformDataListObjects(dataConv);
    }

    static #transformDataObjectItems(data)
    {
        const list = [];
        list.push(data);
        return this.#transformDataListObjects(list);
    }

    static #transformDataListObjects(data)
    {
        const ret = {};

        let objectsCount = 0;

        for(let object of data)
        {
            for(let i = 0; i < Object.keys(object).length; i++)
            {
                if(objectsCount === 0)
                {
                    ret[Object.keys(object)[i]] = [];
                }

                ret[Object.keys(object)[i]].push(Object.values(object)[i]);
            }

            objectsCount += 1;
        }

        return ret;
    }

    static createTableData(data)
    {
        let headers = [];
        let i = 0;

        for(let i of Object.keys(data))
        {
            headers.push(i);
        }

        this.createHeader(headers);
        this.createFooter(headers);

        let values = Object.values(data);

        for(i = 0; i < values[0].length; i++)
        {
            let cell = [];

            for(let j = 0; j < values.length; j++)
            {
                cell.push(values[j][i]);
            }

            this.createRow(cell, i % 2 === 0 ? 'tr-dark' : 'tr-light');
        }

        return i;
    }

    static createHeader(data)
    {
        const tr = document.createElement('tr')
        tr.classList.add('tr-light');

        for(let i of data)
        {
            const th = document.createElement('th');

            const inner = this.getClues().includes(i.toLowerCase()) ? this.getLink('#', i) : this.getP(i);

            th.append(inner);

            tr.append(th);
        }

        tableHead.append(tr);
    }

    static createFooter(data)
    {
        const tr = document.createElement('tr')
        tr.classList.add('tr-light');

        for(let i of data)
        {
            const th = document.createElement('th');

            const inner = this.getClues().includes(i.toLowerCase()) ? this.getLink('#', i) : this.getP(i);

            th.append(inner);

            tr.append(th);
        }

        tableFoot.append(tr);
    }

    static createRow(data, cssClass = null)
    {
        let tableBody = table.getElementsByTagName('tbody')[0];
        const row = tableBody.insertRow();
        row.classList.add(cssClass);
        
        for(let i = 0; i < data.length; i++)
        {
            
            const cell = row.insertCell(i);

            const inner = this.getP(data.at(i));

            cell.append(inner);
        }
    }

    static getP(text)
    {
        const p = document.createElement('p');
        p.textContent = text;
        return p;
    }

    static getLink(href, text)
    {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    }

    static getClues()
    {
        return this.clues;
    }

    static addClues(clues)
    {
        this.clues.push(clues);
    }

    static removeClues(clues)
    {
        this.clues.splice(this.clues.indexOf(clues), 1);
    }

    static capitalizeFirst(text)
    {
        let ret = "";

        for(let i = 0; i < text.length; i++)
        {
            if(i === 0)
            {
                ret += text.charAt(i).toUpperCase();
            }
            else
            {
                ret += text.charAt(i);
            }
        }

        return ret;
    }

    static #getKeysAndValues(data, type)
    {
        const dataConv = this.transformData(data, type);
        const ret = [];

        for(let obj of Object.keys(dataConv))
        {
            ret.push({[obj]: dataConv[obj][0]});
        }

        return ret;
    }

    static createParameters(data, type, container)
    {
        const dataConv = this.#getKeysAndValues(data, type);

        for(let i = 0; i < dataConv.length; i++)
        {
            const key = Object.keys(dataConv[i])[0];
            const isRequired = this.requiredParameters.includes(key.toLowerCase());

            switch(typeof(dataConv[i][key]))
            {
                case "string":
                    container.append(this.createStringParameter(key, isRequired));
                    break;
                case "boolean":
                    container.append(this.createBooleanParameter(key));
                    break;
                case "number":
                    container.append(this.createStringParameter(key, isRequired));
            }
        }
    }

    static #createKeyParameterElement(key, required)
    {
        const parameter = document.createElement('div');
        parameter.classList.add('parameter');

        const keyContainer = document.createElement('div');
        keyContainer.classList.add('key-container');

        const keyValue = document.createElement('p');
        keyValue.className = 'keys';
        keyValue.textContent = key;
        keyContainer.append(keyValue);

        if(required)
        {
            const span = document.createElement('span');
            span.textContent = ' (required)';
            keyContainer.append(span);
        }

        parameter.append(keyContainer);

        return parameter;
    }

    static createStringParameter(key, required)
    {
        
        const parameter = this.#createKeyParameterElement(key, required);
        
        const inputValue = document.createElement('input');
        inputValue.classList.add('input-normal');
        inputValue.id = "element_" + key;

        parameter.append(inputValue);

        return parameter;
    }

    static createBooleanParameter(key)
    {
        const parameter = this.#createKeyParameterElement(key, false);

        const checkContainer = document.createElement('div');
        checkContainer.classList.add('custom-control', 'custom-checkbox', 'checkbox-container');

        const inputCheckbox = document.createElement('input');
        inputCheckbox.type = 'checkbox';
        inputCheckbox.classList.add("custom-control-input", "dash-check");
        inputCheckbox.id = "element_" + key;
        
        const label = document.createElement('label');
        label.classList.add('custom-control-label');
        label.htmlFor = inputCheckbox.id;
        label.textContent = 'Enable/Disable ' + key;

        checkContainer.append(inputCheckbox, label);

        parameter.append(checkContainer);

        return parameter;
    }

    static addObjectData(data, objData)
    {
        for(let key of Object.keys(objData))
        {
            data[key].push(objData[key]);
        }

        return data;
    }

    static getParametersObject()
    {
        const ret = {};

        const keys = document.getElementsByClassName('keys');

        for(let i = 0; i < keys.length; i++)
        {
            let element = document.getElementById('element_' + keys[i].textContent);

            if(element.type === 'checkbox')
                ret[keys[i].textContent] = element.checked;
            else
                ret[keys[i].textContent] = element.value;
        }

        return ret;
    }
}
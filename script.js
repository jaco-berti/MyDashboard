import { Dashboard } from './dashboard.js';
import { ApiRequest } from './request.js';

const dropArea = document.getElementById('drop-area');
const fileElem = document.getElementById('fileElem');
const chooseBtn = document.getElementById('chooseBtn');
const panelSelector = document.getElementById('panelSelector');
const dashboard = document.getElementById('dashboard');
const tableHead = document.getElementById('tableHead');
const tableBody = document.getElementById('tableBody');
const tableFoot = document.getElementById('tableFoot');
const table = document.getElementById('table');
const pFileName = document.getElementById('pFileName');
const btnApiRequest = document.getElementById('btnApiRequest');
const iApiRequest = document.getElementById('iApiRequest');
const orderTypes = document.getElementsByClassName('type-link');
const btnOrderType = document.getElementById('btnOrderType');
const btnAddElement = document.getElementById('btnAddElement');
const addElement = document.getElementById('addElement');
const parameters = document.getElementById('parameters');
const btnSaveEParameters = document.getElementById('btnSaveEParameters');
const btnSaveLParameters = document.getElementById('btnSaveLParameters');

// Local variable
let JSON_DATA = null;
let ORDER_TYPE = "matrix";
let ELEMENT_COUNT = 0;

// Functions to darg and drop the file
/**
 * 
 * Send data to dashboard and switch html element.
 * This function hide the Selector menu and show the dashboard
 * with the json values into the dashboard'table.
 * @returns 
 */
async function sendData(fileName)
{
    console.log(fileName);
    if (JSON_DATA === null) {
        dashboard.style.display = 'none';
        panelSelector.style.display = 'block';
        return;
    }
    else {
        dashboard.style.display = 'block';
        panelSelector.style.display = 'none';

        if(ORDER_TYPE !== 'matrix')
            ELEMENT_COUNT = Dashboard.createTableData(Dashboard.transformData(JSON_DATA, ORDER_TYPE));
        else
            ELEMENT_COUNT = Dashboard.createTableData(JSON_DATA);

        pFileName.textContent = fileName;
    }
}

dropArea.addEventListener('click', (e) => {
    if (e.target !== chooseBtn) fileElem.click();
});

chooseBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    fileElem.click();
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.add('dragover');
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropArea.classList.remove('dragover');
    });
});

dropArea.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    handleFiles(files);
});

fileElem.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    if (files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/json" && !file.name.endsWith('.json')) {
        console.error('File JSON non valido:', file.name);
        return;
    }
    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            JSON_DATA = JSON.parse(e.target.result);
            await sendData(file.name);
        } catch (err) {
            console.error('Errore nel parsing del file JSON:', err);
        }
    };
    reader.readAsText(file);
}

btnApiRequest.addEventListener('click', async () => {
    JSON_DATA = await ApiRequest.get(iApiRequest.value);

    let fileName = 'API response';
    if(ORDER_TYPE === 'item-list')
    {
        fileName = Dashboard.capitalizeFirst(Object.keys(JSON_DATA)[0]);
    }
    sendData(fileName);
});

for(let type of orderTypes)
{
    type.addEventListener('click', () => {
        ORDER_TYPE = type.textContent;
        btnOrderType.textContent = ORDER_TYPE;
    });
}

btnAddElement.addEventListener('click', () => {
    dashboard.style.display = 'none';

    addElement.style.display = 'block';

    resetParameters();
    Dashboard.createParameters(JSON_DATA, ORDER_TYPE, parameters);
});

btnSaveLParameters.addEventListener('click', () => {
    dashboard.style.display = 'block';

    addElement.style.display = 'none';

    addTableRow(Object.values(Dashboard.getParametersObject()));
});

function resetTable()
{
    tableBody.innerHTML = '';
    tableFoot.innerHTML = '';
    tableHead.innerHTML = '';
}

function resetParameters()
{
    parameters.innerHTML = '';
}

function addTableRow(objectList)
{
    const cssClass = ELEMENT_COUNT % 2 === 0 ? 'tr-dark' : 'tr-light';
    Dashboard.createRow(objectList, cssClass);
    ELEMENT_COUNT += 1;
}
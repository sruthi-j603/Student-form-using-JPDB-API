/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */

var jpdbBaseURL="http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var stuDBName = "STU-DB";
var stuRelationName="StuData"; 
var connToken = "90932924|-31949280501235249|90947605";

$("#stuid").focus();

function saveRecNo2LS(jsonObj) 
{ 
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem('recno', lvData.rec_no);
}

function getStuIdAsJsonObj() 
{ 
    var stuid = $('#stuid').val();
    var jsonStr = {
        id: stuid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) 
{
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#stuname").val(record.name);
    $('#stuclass').val(record.class);
    $("#studate").val(record.date); 
    $('#stuaddress').val(record.address);
    $('#stujoindate').val(record.joindate);
}


function resetForm() 
{
    $('#stuid').val("");
    $("#stuname").val("");
    $('#stuclass').val("");
    $("#studate").val("");
    $("#stuaddress").val("");
    $('#stujoindate').val("");
    $('#stuid').prop('disabled', false);
    $('#save').prop("disabled", true);
    $("#change").prop("disabled", true);
    $('#reset').prop("disabled", true);
    $('#stuid').focus();
}

function validateData() 
{ 
    var stuid, stuname, stuclass, studate, stuaddress, stujoindate;
    stuid = $('#stuid').val();
    stuname = $("#stuname").val(); 
    stuclass = $("#stuclass").val();
    studate = $("#studate").val();
    stuaddress = $("#stuaddress").val();
    stujoindate = $("#stujoindate").val();
    
    if (stuid === '') 
    { 
        alert("Student ID missing");
        $('#stuid').focus();
        return "";
    }

    if (stuname === '') 
    { 
        alert("Student Name missing");
        $('#stuname').focus();
        return "";
    }
    
    if (stuclass === '') 
    { 
        alert("Student Class missing");
        $('#stuclass').focus();
        return "";
    }
    
    if (studate === '') 
    { 
        alert("Student Birth Date missing");
        $('#studate').focus();
        return "";
    }
    
    if (stuaddress === '') 
    { 
        alert("Student Address missing");
        $('#stuaddress').focus();
        return "";
    }
    
    if (stujoindate === '') 
    { 
        alert("Student Join Date missing");
        $('#stujoindate').focus();
        return "";
    }
    
    var jsonStrObj = {
        id: stuid,
        name: stuname,
        class: stuclass,
        date: studate,
        address: stuaddress,
        joindate: stujoindate
    };
    return JSON.stringify(jsonStrObj);
}

function getStu()
{
    var stuIdJsonObj = getStuIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, stuDBName, stuRelationName, stuIdJsonObj);
    jQuery.ajaxSetup({async: false}); 
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseURL, jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if (resJsonObj.status === 400)
    {
        $('#Save').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stuname').focus();
    }
    else if (resJsonObj.status === 200)
    {
        $('#stuid').prop('disabled', true);
        fillData(resJsonObj);
        
        $('#change').prop('disabled', false);
        $('#reset').prop('disabled', false);
        $('#stuname').focus();
    }
}

function saveData() 
{
    var jsonStrObj = validateData();
    if (jsonStrObj === "") 
    {
        return '';
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, stuDBName, stuRelationName); 
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseURL, jpdbIML); 
    jQuery.ajaxSetup({async: true});
    resetForm();
    $('#stuid').focus();
}

function changeData() 
{
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordRequest(connToken, jsonChg, stuDBName, stuRelationName, localStorage.getItem("recno")); 
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(updateRequest, jpdbBaseURL, jpdbIML);
    jQuery.ajaxSetup({async: true}); 
    console.log(resJsonObj);
    resetForm();
    $("#stuid").focus();
}


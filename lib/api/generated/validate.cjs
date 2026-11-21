/* Generated from banking-core-api@fc06aebdc53ae2e4a28e54aaeb875294e317e8c1. Run npm run contract:generate to refresh. */
"use strict";
exports.isId = validate20;
const schema31 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Id"};
const schema33 = {"type":"string","format":"uuid"};
const formats0 = /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

function validate20(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate20.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(errors === _errs0){
if(errors === _errs0){
if(typeof data === "string"){
if(!(formats0.test(data))){
validate20.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate20.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
validate20.errors = vErrors;
return errors === 0;
}
validate20.evaluated = {"dynamicProps":false,"dynamicItems":false};

exports.isAccount = validate22;
const schema34 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Account"};
const schema35 = {"type":"object","required":["accountId","recipientReference","status","currency","availableBalanceMinor"],"properties":{"accountId":{"$ref":"#/components/schemas/Id"},"recipientReference":{"$ref":"#/components/schemas/RecipientReference"},"status":{"type":"string","enum":["ACTIVE","FROZEN","CLOSED"]},"currency":{"$ref":"#/components/schemas/Currency"},"availableBalanceMinor":{"$ref":"#/components/schemas/MinorUnits"}}};
const schema37 = {"type":"string","minLength":1,"maxLength":128,"description":"Opaque, case-sensitive payment address. Clients preserve it verbatim."};
const schema38 = {"type":"string","enum":["PHP"]};
const schema39 = {"type":"string","minLength":1,"maxLength":19,"pattern":"^(0|[1-9][0-9]*)$","description":"Nonnegative centavos up to 9223372036854775807 inclusive.","anyOf":[{"maxLength":18},{"pattern":"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"}]};
const func1 = require("ajv/dist/runtime/ucs2length").default;
const pattern4 = new RegExp("^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])", "u");
const pattern5 = new RegExp("^(0|[1-9][0-9]*)$", "u");

function validate23(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate23.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.accountId === undefined) && (missing0 = "accountId")) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.availableBalanceMinor === undefined) && (missing0 = "availableBalanceMinor"))){
validate23.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.accountId !== undefined){
let data0 = data.accountId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate23.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate23.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data1 = data.recipientReference;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate23.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate23.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate23.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs7 = errors;
if(typeof data2 !== "string"){
validate23.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "ACTIVE") || (data2 === "FROZEN")) || (data2 === "CLOSED"))){
validate23.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema35.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data3 = data.currency;
const _errs9 = errors;
if(typeof data3 !== "string"){
validate23.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data3 === "PHP")){
validate23.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema38.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availableBalanceMinor !== undefined){
let data4 = data.availableBalanceMinor;
const _errs12 = errors;
const _errs13 = errors;
const _errs15 = errors;
let valid5 = false;
const _errs16 = errors;
if(typeof data4 === "string"){
if(func1(data4) > 18){
const err0 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 18},message:"must NOT have more than 18 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs16 === errors;
valid5 = valid5 || _valid0;
const _errs17 = errors;
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err1 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"},message:"must match pattern \""+"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs17 === errors;
valid5 = valid5 || _valid0;
if(!valid5){
const err2 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate23.errors = vErrors;
return false;
}
else {
errors = _errs15;
if(vErrors !== null){
if(_errs15){
vErrors.length = _errs15;
}
else {
vErrors = null;
}
}
}
if(errors === _errs13){
if(typeof data4 === "string"){
if(func1(data4) > 19){
validate23.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/maxLength",keyword:"maxLength",params:{limit: 19},message:"must NOT have more than 19 characters"}];
return false;
}
else {
if(func1(data4) < 1){
validate23.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern5.test(data4)){
validate23.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|[1-9][0-9]*)$"+"\""}];
return false;
}
}
}
}
else {
validate23.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate23.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate23.errors = vErrors;
return errors === 0;
}
validate23.evaluated = {"props":{"accountId":true,"recipientReference":true,"status":true,"currency":true,"availableBalanceMinor":true},"dynamicProps":false,"dynamicItems":false};


function validate22(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate22.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate23(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
validate22.errors = vErrors;
return errors === 0;
}
validate22.evaluated = {"props":{"accountId":true,"recipientReference":true,"status":true,"currency":true,"availableBalanceMinor":true},"dynamicProps":false,"dynamicItems":false};

exports.isAccountPage = validate25;
const schema40 = {"$ref":"urn:tiwalo:banking-v1#/paths/~1accounts/get/responses/200/content/application~1json/schema"};
const schema41 = {"type":"object","required":["accounts"],"properties":{"accounts":{"type":"array","maxItems":100,"items":{"$ref":"#/components/schemas/Account"}},"nextCursor":{"$ref":"#/components/schemas/Cursor"}}};
const schema47 = {"type":"string","minLength":1,"maxLength":512};

function validate27(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate27.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((data.accountId === undefined) && (missing0 = "accountId")) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.availableBalanceMinor === undefined) && (missing0 = "availableBalanceMinor"))){
validate27.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.accountId !== undefined){
let data0 = data.accountId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate27.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate27.errors = [{instancePath:instancePath+"/accountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data1 = data.recipientReference;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate27.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate27.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate27.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data2 = data.status;
const _errs7 = errors;
if(typeof data2 !== "string"){
validate27.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(((data2 === "ACTIVE") || (data2 === "FROZEN")) || (data2 === "CLOSED"))){
validate27.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema35.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data3 = data.currency;
const _errs9 = errors;
if(typeof data3 !== "string"){
validate27.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data3 === "PHP")){
validate27.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema38.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.availableBalanceMinor !== undefined){
let data4 = data.availableBalanceMinor;
const _errs12 = errors;
const _errs13 = errors;
const _errs15 = errors;
let valid5 = false;
const _errs16 = errors;
if(typeof data4 === "string"){
if(func1(data4) > 18){
const err0 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 18},message:"must NOT have more than 18 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs16 === errors;
valid5 = valid5 || _valid0;
const _errs17 = errors;
if(typeof data4 === "string"){
if(!pattern4.test(data4)){
const err1 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"},message:"must match pattern \""+"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs17 === errors;
valid5 = valid5 || _valid0;
if(!valid5){
const err2 = {instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate27.errors = vErrors;
return false;
}
else {
errors = _errs15;
if(vErrors !== null){
if(_errs15){
vErrors.length = _errs15;
}
else {
vErrors = null;
}
}
}
if(errors === _errs13){
if(typeof data4 === "string"){
if(func1(data4) > 19){
validate27.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/maxLength",keyword:"maxLength",params:{limit: 19},message:"must NOT have more than 19 characters"}];
return false;
}
else {
if(func1(data4) < 1){
validate27.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern5.test(data4)){
validate27.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|[1-9][0-9]*)$"+"\""}];
return false;
}
}
}
}
else {
validate27.errors = [{instancePath:instancePath+"/availableBalanceMinor",schemaPath:"#/components/schemas/MinorUnits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate27.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate27.errors = vErrors;
return errors === 0;
}
validate27.evaluated = {"props":{"accountId":true,"recipientReference":true,"status":true,"currency":true,"availableBalanceMinor":true},"dynamicProps":false,"dynamicItems":false};


function validate26(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate26.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.accounts === undefined) && (missing0 = "accounts")){
validate26.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.accounts !== undefined){
let data0 = data.accounts;
const _errs1 = errors;
if(errors === _errs1){
if(Array.isArray(data0)){
if(data0.length > 100){
validate26.errors = [{instancePath:instancePath+"/accounts",schemaPath:"#/properties/accounts/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid1 = true;
const len0 = data0.length;
for(let i0=0; i0<len0; i0++){
const _errs3 = errors;
if(!(validate27(data0[i0], {instancePath:instancePath+"/accounts/" + i0,parentData:data0,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate27.errors : vErrors.concat(validate27.errors);
errors = vErrors.length;
}
var valid1 = _errs3 === errors;
if(!valid1){
break;
}
}
}
}
else {
validate26.errors = [{instancePath:instancePath+"/accounts",schemaPath:"#/properties/accounts/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nextCursor !== undefined){
let data2 = data.nextCursor;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(typeof data2 === "string"){
if(func1(data2) > 512){
validate26.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/Cursor/maxLength",keyword:"maxLength",params:{limit: 512},message:"must NOT have more than 512 characters"}];
return false;
}
else {
if(func1(data2) < 1){
validate26.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/Cursor/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate26.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/Cursor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
}
}
}
else {
validate26.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate26.errors = vErrors;
return errors === 0;
}
validate26.evaluated = {"props":{"accounts":true,"nextCursor":true},"dynamicProps":false,"dynamicItems":false};


function validate25(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate25.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate26(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate26.errors : vErrors.concat(validate26.errors);
errors = vErrors.length;
}
validate25.errors = vErrors;
return errors === 0;
}
validate25.evaluated = {"props":{"accounts":true,"nextCursor":true},"dynamicProps":false,"dynamicItems":false};

exports.isTransferRequest = validate30;
const schema48 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/TransferRequest"};
const schema49 = {"type":"object","additionalProperties":false,"required":["sourceAccountId","recipientReference","currency","amountMinor"],"properties":{"sourceAccountId":{"$ref":"#/components/schemas/Id"},"recipientReference":{"$ref":"#/components/schemas/RecipientReference"},"currency":{"$ref":"#/components/schemas/Currency"},"amountMinor":{"$ref":"#/components/schemas/TransferAmountMinor"}}};
const schema53 = {"allOf":[{"$ref":"#/components/schemas/MinorUnits"},{"type":"string","pattern":"^[1-9]"}],"description":"Positive centavos up to 9223372036854775807 inclusive. Out-of-range values are invalid requests."};
const pattern10 = new RegExp("^[1-9]", "u");

function validate32(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate32.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
const _errs1 = errors;
const _errs3 = errors;
let valid2 = false;
const _errs4 = errors;
if(typeof data === "string"){
if(func1(data) > 18){
const err0 = {instancePath,schemaPath:"#/components/schemas/MinorUnits/anyOf/0/maxLength",keyword:"maxLength",params:{limit: 18},message:"must NOT have more than 18 characters"};
if(vErrors === null){
vErrors = [err0];
}
else {
vErrors.push(err0);
}
errors++;
}
}
var _valid0 = _errs4 === errors;
valid2 = valid2 || _valid0;
const _errs5 = errors;
if(typeof data === "string"){
if(!pattern4.test(data)){
const err1 = {instancePath,schemaPath:"#/components/schemas/MinorUnits/anyOf/1/pattern",keyword:"pattern",params:{pattern: "^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"},message:"must match pattern \""+"^(?:[1-8]|9[01]|92[01]|922[0-2]|9223[0-2]|92233[0-6]|922337[01]|92233720[0-2]|922337203[0-5]|9223372036[0-7]|92233720368[0-4]|922337203685[0-3]|9223372036854[0-6]|92233720368547[0-6]|922337203685477[0-4]|9223372036854775[0-7]|922337203685477580[0-7])"+"\""};
if(vErrors === null){
vErrors = [err1];
}
else {
vErrors.push(err1);
}
errors++;
}
}
var _valid0 = _errs5 === errors;
valid2 = valid2 || _valid0;
if(!valid2){
const err2 = {instancePath,schemaPath:"#/components/schemas/MinorUnits/anyOf",keyword:"anyOf",params:{},message:"must match a schema in anyOf"};
if(vErrors === null){
vErrors = [err2];
}
else {
vErrors.push(err2);
}
errors++;
validate32.errors = vErrors;
return false;
}
else {
errors = _errs3;
if(vErrors !== null){
if(_errs3){
vErrors.length = _errs3;
}
else {
vErrors = null;
}
}
}
if(errors === _errs1){
if(typeof data === "string"){
if(func1(data) > 19){
validate32.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/maxLength",keyword:"maxLength",params:{limit: 19},message:"must NOT have more than 19 characters"}];
return false;
}
else {
if(func1(data) < 1){
validate32.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern5.test(data)){
validate32.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/pattern",keyword:"pattern",params:{pattern: "^(0|[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|[1-9][0-9]*)$"+"\""}];
return false;
}
}
}
}
else {
validate32.errors = [{instancePath,schemaPath:"#/components/schemas/MinorUnits/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs0 === errors;
if(valid0){
const _errs6 = errors;
if(errors === _errs6){
if(typeof data === "string"){
if(!pattern10.test(data)){
validate32.errors = [{instancePath,schemaPath:"#/allOf/1/pattern",keyword:"pattern",params:{pattern: "^[1-9]"},message:"must match pattern \""+"^[1-9]"+"\""}];
return false;
}
}
else {
validate32.errors = [{instancePath,schemaPath:"#/allOf/1/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs6 === errors;
}
validate32.errors = vErrors;
return errors === 0;
}
validate32.evaluated = {"dynamicProps":false,"dynamicItems":false};


function validate31(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate31.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.sourceAccountId === undefined) && (missing0 = "sourceAccountId")) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.amountMinor === undefined) && (missing0 = "amountMinor"))){
validate31.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
const _errs1 = errors;
for(const key0 in data){
if(!((((key0 === "sourceAccountId") || (key0 === "recipientReference")) || (key0 === "currency")) || (key0 === "amountMinor"))){
validate31.errors = [{instancePath,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty: key0},message:"must NOT have additional properties"}];
return false;
break;
}
}
if(_errs1 === errors){
if(data.sourceAccountId !== undefined){
let data0 = data.sourceAccountId;
const _errs2 = errors;
const _errs3 = errors;
if(errors === _errs3){
if(errors === _errs3){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate31.errors = [{instancePath:instancePath+"/sourceAccountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate31.errors = [{instancePath:instancePath+"/sourceAccountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs2 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data1 = data.recipientReference;
const _errs5 = errors;
const _errs6 = errors;
if(errors === _errs6){
if(typeof data1 === "string"){
if(func1(data1) > 128){
validate31.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data1) < 1){
validate31.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate31.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data2 = data.currency;
const _errs8 = errors;
if(typeof data2 !== "string"){
validate31.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data2 === "PHP")){
validate31.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema38.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.amountMinor !== undefined){
const _errs11 = errors;
if(!(validate32(data.amountMinor, {instancePath:instancePath+"/amountMinor",parentData:data,parentDataProperty:"amountMinor",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
else {
validate31.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate31.errors = vErrors;
return errors === 0;
}
validate31.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};


function validate30(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate30.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate31(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate31.errors : vErrors.concat(validate31.errors);
errors = vErrors.length;
}
validate30.errors = vErrors;
return errors === 0;
}
validate30.evaluated = {"props":true,"dynamicProps":false,"dynamicItems":false};

exports.isIdempotencyKey = validate35;
const schema55 = {"$ref":"urn:tiwalo:banking-v1#/paths/~1transfers/post/parameters/0/schema"};
const schema56 = {"type":"string","minLength":1,"maxLength":128,"pattern":"^[A-Za-z0-9._~-]+$"};
const pattern11 = new RegExp("^[A-Za-z0-9._~-]+$", "u");

function validate35(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate35.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(errors === _errs0){
if(typeof data === "string"){
if(func1(data) > 128){
validate35.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1transfers/post/parameters/0/schema/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data) < 1){
validate35.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1transfers/post/parameters/0/schema/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
else {
if(!pattern11.test(data)){
validate35.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1transfers/post/parameters/0/schema/pattern",keyword:"pattern",params:{pattern: "^[A-Za-z0-9._~-]+$"},message:"must match pattern \""+"^[A-Za-z0-9._~-]+$"+"\""}];
return false;
}
}
}
}
else {
validate35.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/paths/~1transfers/post/parameters/0/schema/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
validate35.errors = vErrors;
return errors === 0;
}
validate35.evaluated = {"dynamicProps":false,"dynamicItems":false};

exports.isTransferReceipt = validate36;
const schema57 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/TransferReceipt"};
const schema58 = {"type":"object","required":["transferId","sourceAccountId","recipientReference","currency","amountMinor","status","postedAt"],"properties":{"transferId":{"$ref":"#/components/schemas/Id"},"sourceAccountId":{"$ref":"#/components/schemas/Id"},"recipientReference":{"$ref":"#/components/schemas/RecipientReference"},"currency":{"$ref":"#/components/schemas/Currency"},"amountMinor":{"$ref":"#/components/schemas/TransferAmountMinor"},"status":{"type":"string","enum":["POSTED"]},"postedAt":{"type":"string","format":"date-time"}}};
const formats12 = require("ajv-formats/dist/formats").fullFormats["date-time"];

function validate37(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate37.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((((((data.transferId === undefined) && (missing0 = "transferId")) || ((data.sourceAccountId === undefined) && (missing0 = "sourceAccountId"))) || ((data.recipientReference === undefined) && (missing0 = "recipientReference"))) || ((data.currency === undefined) && (missing0 = "currency"))) || ((data.amountMinor === undefined) && (missing0 = "amountMinor"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.postedAt === undefined) && (missing0 = "postedAt"))){
validate37.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.transferId !== undefined){
let data0 = data.transferId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate37.errors = [{instancePath:instancePath+"/transferId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate37.errors = [{instancePath:instancePath+"/transferId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.sourceAccountId !== undefined){
let data1 = data.sourceAccountId;
const _errs4 = errors;
const _errs5 = errors;
if(errors === _errs5){
if(errors === _errs5){
if(typeof data1 === "string"){
if(!(formats0.test(data1))){
validate37.errors = [{instancePath:instancePath+"/sourceAccountId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate37.errors = [{instancePath:instancePath+"/sourceAccountId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.recipientReference !== undefined){
let data2 = data.recipientReference;
const _errs7 = errors;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data2 === "string"){
if(func1(data2) > 128){
validate37.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/maxLength",keyword:"maxLength",params:{limit: 128},message:"must NOT have more than 128 characters"}];
return false;
}
else {
if(func1(data2) < 1){
validate37.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/minLength",keyword:"minLength",params:{limit: 1},message:"must NOT have fewer than 1 characters"}];
return false;
}
}
}
else {
validate37.errors = [{instancePath:instancePath+"/recipientReference",schemaPath:"#/components/schemas/RecipientReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data3 = data.currency;
const _errs10 = errors;
if(typeof data3 !== "string"){
validate37.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data3 === "PHP")){
validate37.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema38.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs10 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.amountMinor !== undefined){
const _errs13 = errors;
if(!(validate32(data.amountMinor, {instancePath:instancePath+"/amountMinor",parentData:data,parentDataProperty:"amountMinor",rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate32.errors : vErrors.concat(validate32.errors);
errors = vErrors.length;
}
var valid0 = _errs13 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.status !== undefined){
let data5 = data.status;
const _errs14 = errors;
if(typeof data5 !== "string"){
validate37.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data5 === "POSTED")){
validate37.errors = [{instancePath:instancePath+"/status",schemaPath:"#/properties/status/enum",keyword:"enum",params:{allowedValues: schema58.properties.status.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs14 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.postedAt !== undefined){
let data6 = data.postedAt;
const _errs16 = errors;
if(errors === _errs16){
if(errors === _errs16){
if(typeof data6 === "string"){
if(!(formats12.validate(data6))){
validate37.errors = [{instancePath:instancePath+"/postedAt",schemaPath:"#/properties/postedAt/format",keyword:"format",params:{format: "date-time"},message:"must match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate37.errors = [{instancePath:instancePath+"/postedAt",schemaPath:"#/properties/postedAt/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs16 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate37.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate37.errors = vErrors;
return errors === 0;
}
validate37.evaluated = {"props":{"transferId":true,"sourceAccountId":true,"recipientReference":true,"currency":true,"amountMinor":true,"status":true,"postedAt":true},"dynamicProps":false,"dynamicItems":false};


function validate36(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate36.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate37(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate37.errors : vErrors.concat(validate37.errors);
errors = vErrors.length;
}
validate36.errors = vErrors;
return errors === 0;
}
validate36.evaluated = {"props":{"transferId":true,"sourceAccountId":true,"recipientReference":true,"currency":true,"amountMinor":true,"status":true,"postedAt":true},"dynamicProps":false,"dynamicItems":false};

exports.isFindingsPage = validate40;
const schema63 = {"$ref":"urn:tiwalo:banking-v1#/paths/~1operations~1reconciliations~1{runId}~1findings/get/responses/200/content/application~1json/schema"};
const schema64 = {"type":"object","required":["runId","findings"],"properties":{"runId":{"$ref":"#/components/schemas/Id"},"findings":{"type":"array","maxItems":100,"items":{"$ref":"#/components/schemas/ReconciliationFinding"}},"nextCursor":{"$ref":"#/components/schemas/FindingReference"}}};
const schema67 = {"type":"string","pattern":"^[0-9a-f]{64}$","description":"Opaque reference stable across runs for the same check, subject and currency."};
const schema66 = {"type":"object","required":["reference","code"],"properties":{"reference":{"$ref":"#/components/schemas/FindingReference"},"code":{"type":"string","enum":["MISSING_PROJECTION","BALANCE_MISMATCH","JOURNAL_IMBALANCE","TRANSFER_JOURNAL_MISMATCH","JOURNAL_WITHOUT_TRANSFER","MISSING_POSTING_AUDIT","POSTING_AUDIT_MISMATCH","AUDIT_WITHOUT_JOURNAL"]},"currency":{"$ref":"#/components/schemas/Currency"},"computedBalanceMinor":{"$ref":"#/components/schemas/EvidenceMinor"},"projectedBalanceMinor":{"$ref":"#/components/schemas/EvidenceMinor"},"debitTotalMinor":{"$ref":"#/components/schemas/EvidenceMinor"},"creditTotalMinor":{"$ref":"#/components/schemas/EvidenceMinor"}},"description":"Balance findings include the recomputed balance and any existing projection. Journal imbalance includes both per-currency totals. Link findings carry only a reference and code."};
const schema69 = {"type":"string","pattern":"^(0|-?[1-9][0-9]*)$","description":"Exact centavos from a diagnostic calculation. Inconsistent data can produce negative or out-of-BIGINT totals."};
const pattern12 = new RegExp("^[0-9a-f]{64}$", "u");
const pattern13 = new RegExp("^(0|-?[1-9][0-9]*)$", "u");

function validate42(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate42.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.reference === undefined) && (missing0 = "reference")) || ((data.code === undefined) && (missing0 = "code"))){
validate42.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.reference !== undefined){
let data0 = data.reference;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(typeof data0 === "string"){
if(!pattern12.test(data0)){
validate42.errors = [{instancePath:instancePath+"/reference",schemaPath:"#/components/schemas/FindingReference/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/reference",schemaPath:"#/components/schemas/FindingReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.code !== undefined){
let data1 = data.code;
const _errs4 = errors;
if(typeof data1 !== "string"){
validate42.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!((((((((data1 === "MISSING_PROJECTION") || (data1 === "BALANCE_MISMATCH")) || (data1 === "JOURNAL_IMBALANCE")) || (data1 === "TRANSFER_JOURNAL_MISMATCH")) || (data1 === "JOURNAL_WITHOUT_TRANSFER")) || (data1 === "MISSING_POSTING_AUDIT")) || (data1 === "POSTING_AUDIT_MISMATCH")) || (data1 === "AUDIT_WITHOUT_JOURNAL"))){
validate42.errors = [{instancePath:instancePath+"/code",schemaPath:"#/properties/code/enum",keyword:"enum",params:{allowedValues: schema66.properties.code.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.currency !== undefined){
let data2 = data.currency;
const _errs6 = errors;
if(typeof data2 !== "string"){
validate42.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
if(!(data2 === "PHP")){
validate42.errors = [{instancePath:instancePath+"/currency",schemaPath:"#/components/schemas/Currency/enum",keyword:"enum",params:{allowedValues: schema38.enum},message:"must be equal to one of the allowed values"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.computedBalanceMinor !== undefined){
let data3 = data.computedBalanceMinor;
const _errs9 = errors;
const _errs10 = errors;
if(errors === _errs10){
if(typeof data3 === "string"){
if(!pattern13.test(data3)){
validate42.errors = [{instancePath:instancePath+"/computedBalanceMinor",schemaPath:"#/components/schemas/EvidenceMinor/pattern",keyword:"pattern",params:{pattern: "^(0|-?[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|-?[1-9][0-9]*)$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/computedBalanceMinor",schemaPath:"#/components/schemas/EvidenceMinor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.projectedBalanceMinor !== undefined){
let data4 = data.projectedBalanceMinor;
const _errs12 = errors;
const _errs13 = errors;
if(errors === _errs13){
if(typeof data4 === "string"){
if(!pattern13.test(data4)){
validate42.errors = [{instancePath:instancePath+"/projectedBalanceMinor",schemaPath:"#/components/schemas/EvidenceMinor/pattern",keyword:"pattern",params:{pattern: "^(0|-?[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|-?[1-9][0-9]*)$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/projectedBalanceMinor",schemaPath:"#/components/schemas/EvidenceMinor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs12 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.debitTotalMinor !== undefined){
let data5 = data.debitTotalMinor;
const _errs15 = errors;
const _errs16 = errors;
if(errors === _errs16){
if(typeof data5 === "string"){
if(!pattern13.test(data5)){
validate42.errors = [{instancePath:instancePath+"/debitTotalMinor",schemaPath:"#/components/schemas/EvidenceMinor/pattern",keyword:"pattern",params:{pattern: "^(0|-?[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|-?[1-9][0-9]*)$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/debitTotalMinor",schemaPath:"#/components/schemas/EvidenceMinor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs15 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.creditTotalMinor !== undefined){
let data6 = data.creditTotalMinor;
const _errs18 = errors;
const _errs19 = errors;
if(errors === _errs19){
if(typeof data6 === "string"){
if(!pattern13.test(data6)){
validate42.errors = [{instancePath:instancePath+"/creditTotalMinor",schemaPath:"#/components/schemas/EvidenceMinor/pattern",keyword:"pattern",params:{pattern: "^(0|-?[1-9][0-9]*)$"},message:"must match pattern \""+"^(0|-?[1-9][0-9]*)$"+"\""}];
return false;
}
}
else {
validate42.errors = [{instancePath:instancePath+"/creditTotalMinor",schemaPath:"#/components/schemas/EvidenceMinor/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs18 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
else {
validate42.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate42.errors = vErrors;
return errors === 0;
}
validate42.evaluated = {"props":{"reference":true,"code":true,"currency":true,"computedBalanceMinor":true,"projectedBalanceMinor":true,"debitTotalMinor":true,"creditTotalMinor":true},"dynamicProps":false,"dynamicItems":false};


function validate41(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate41.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((data.runId === undefined) && (missing0 = "runId")) || ((data.findings === undefined) && (missing0 = "findings"))){
validate41.errors = [{instancePath,schemaPath:"#/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.runId !== undefined){
let data0 = data.runId;
const _errs1 = errors;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats0.test(data0))){
validate41.errors = [{instancePath:instancePath+"/runId",schemaPath:"#/components/schemas/Id/format",keyword:"format",params:{format: "uuid"},message:"must match format \""+"uuid"+"\""}];
return false;
}
}
else {
validate41.errors = [{instancePath:instancePath+"/runId",schemaPath:"#/components/schemas/Id/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.findings !== undefined){
let data1 = data.findings;
const _errs4 = errors;
if(errors === _errs4){
if(Array.isArray(data1)){
if(data1.length > 100){
validate41.errors = [{instancePath:instancePath+"/findings",schemaPath:"#/properties/findings/maxItems",keyword:"maxItems",params:{limit: 100},message:"must NOT have more than 100 items"}];
return false;
}
else {
var valid2 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs6 = errors;
if(!(validate42(data1[i0], {instancePath:instancePath+"/findings/" + i0,parentData:data1,parentDataProperty:i0,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate42.errors : vErrors.concat(validate42.errors);
errors = vErrors.length;
}
var valid2 = _errs6 === errors;
if(!valid2){
break;
}
}
}
}
else {
validate41.errors = [{instancePath:instancePath+"/findings",schemaPath:"#/properties/findings/type",keyword:"type",params:{type: "array"},message:"must be array"}];
return false;
}
}
var valid0 = _errs4 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nextCursor !== undefined){
let data3 = data.nextCursor;
const _errs7 = errors;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern12.test(data3)){
validate41.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/FindingReference/pattern",keyword:"pattern",params:{pattern: "^[0-9a-f]{64}$"},message:"must match pattern \""+"^[0-9a-f]{64}$"+"\""}];
return false;
}
}
else {
validate41.errors = [{instancePath:instancePath+"/nextCursor",schemaPath:"#/components/schemas/FindingReference/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
else {
validate41.errors = [{instancePath,schemaPath:"#/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate41.errors = vErrors;
return errors === 0;
}
validate41.evaluated = {"props":{"runId":true,"findings":true,"nextCursor":true},"dynamicProps":false,"dynamicItems":false};


function validate40(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate40.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
if(!(validate41(data, {instancePath,parentData,parentDataProperty,rootData,dynamicAnchors}))){
vErrors = vErrors === null ? validate41.errors : vErrors.concat(validate41.errors);
errors = vErrors.length;
}
validate40.errors = vErrors;
return errors === 0;
}
validate40.evaluated = {"props":{"runId":true,"findings":true,"nextCursor":true},"dynamicProps":false,"dynamicItems":false};

exports.isProblem = validate45;
const schema74 = {"$ref":"urn:tiwalo:banking-v1#/components/schemas/Problem"};
const schema75 = {"type":"object","description":"RFC 9457 Problem Details. Branch on the stable code. User-facing text may change.","required":["type","title","status","code"],"properties":{"type":{"type":"string","format":"uri"},"title":{"type":"string"},"status":{"type":"integer","minimum":400,"maximum":599},"code":{"type":"string","pattern":"^[A-Z][A-Z0-9_]*$"},"detail":{"type":"string"},"instance":{"type":"string","format":"uri-reference"}}};
const formats16 = require("ajv-formats/dist/formats").fullFormats.uri;
const formats18 = /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
const pattern18 = new RegExp("^[A-Z][A-Z0-9_]*$", "u");

function validate45(data, {instancePath="", parentData, parentDataProperty, rootData=data, dynamicAnchors={}}={}){
let vErrors = null;
let errors = 0;
const evaluated0 = validate45.evaluated;
if(evaluated0.dynamicProps){
evaluated0.props = undefined;
}
if(evaluated0.dynamicItems){
evaluated0.items = undefined;
}
const _errs0 = errors;
if(errors === _errs0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if(((((data.type === undefined) && (missing0 = "type")) || ((data.title === undefined) && (missing0 = "title"))) || ((data.status === undefined) && (missing0 = "status"))) || ((data.code === undefined) && (missing0 = "code"))){
validate45.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/required",keyword:"required",params:{missingProperty: missing0},message:"must have required property '"+missing0+"'"}];
return false;
}
else {
if(data.type !== undefined){
let data0 = data.type;
const _errs2 = errors;
if(errors === _errs2){
if(errors === _errs2){
if(typeof data0 === "string"){
if(!(formats16(data0))){
validate45.errors = [{instancePath:instancePath+"/type",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/type/format",keyword:"format",params:{format: "uri"},message:"must match format \""+"uri"+"\""}];
return false;
}
}
else {
validate45.errors = [{instancePath:instancePath+"/type",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/type/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid1 = _errs2 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.title !== undefined){
const _errs4 = errors;
if(typeof data.title !== "string"){
validate45.errors = [{instancePath:instancePath+"/title",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/title/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs4 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.status !== undefined){
let data2 = data.status;
const _errs6 = errors;
if(!((typeof data2 == "number") && (!(data2 % 1) && !isNaN(data2)))){
validate45.errors = [{instancePath:instancePath+"/status",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/status/type",keyword:"type",params:{type: "integer"},message:"must be integer"}];
return false;
}
if(errors === _errs6){
if(typeof data2 == "number"){
if(data2 > 599 || isNaN(data2)){
validate45.errors = [{instancePath:instancePath+"/status",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/status/maximum",keyword:"maximum",params:{comparison: "<=", limit: 599},message:"must be <= 599"}];
return false;
}
else {
if(data2 < 400 || isNaN(data2)){
validate45.errors = [{instancePath:instancePath+"/status",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/status/minimum",keyword:"minimum",params:{comparison: ">=", limit: 400},message:"must be >= 400"}];
return false;
}
}
}
}
var valid1 = _errs6 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.code !== undefined){
let data3 = data.code;
const _errs8 = errors;
if(errors === _errs8){
if(typeof data3 === "string"){
if(!pattern18.test(data3)){
validate45.errors = [{instancePath:instancePath+"/code",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/code/pattern",keyword:"pattern",params:{pattern: "^[A-Z][A-Z0-9_]*$"},message:"must match pattern \""+"^[A-Z][A-Z0-9_]*$"+"\""}];
return false;
}
}
else {
validate45.errors = [{instancePath:instancePath+"/code",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/code/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
var valid1 = _errs8 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.detail !== undefined){
const _errs10 = errors;
if(typeof data.detail !== "string"){
validate45.errors = [{instancePath:instancePath+"/detail",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/detail/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
var valid1 = _errs10 === errors;
}
else {
var valid1 = true;
}
if(valid1){
if(data.instance !== undefined){
let data5 = data.instance;
const _errs12 = errors;
if(errors === _errs12){
if(errors === _errs12){
if(typeof data5 === "string"){
if(!(formats18.test(data5))){
validate45.errors = [{instancePath:instancePath+"/instance",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/instance/format",keyword:"format",params:{format: "uri-reference"},message:"must match format \""+"uri-reference"+"\""}];
return false;
}
}
else {
validate45.errors = [{instancePath:instancePath+"/instance",schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/properties/instance/type",keyword:"type",params:{type: "string"},message:"must be string"}];
return false;
}
}
}
var valid1 = _errs12 === errors;
}
else {
var valid1 = true;
}
}
}
}
}
}
}
}
else {
validate45.errors = [{instancePath,schemaPath:"urn:tiwalo:banking-v1#/components/schemas/Problem/type",keyword:"type",params:{type: "object"},message:"must be object"}];
return false;
}
}
validate45.errors = vErrors;
return errors === 0;
}
validate45.evaluated = {"props":{"type":true,"title":true,"status":true,"code":true,"detail":true,"instance":true},"dynamicProps":false,"dynamicItems":false};


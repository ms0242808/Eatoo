!function(t,e){t=t||"docReady";var n=[],o=!1,i=!1;function r(){if(!o){o=!0;for(var t=0;t<n.length;t++)n[t].fn.call(window,n[t].ctx);n=[]}}function a(){"complete"===document.readyState&&r()}(e=e||window)[t]=function(t,e){if("function"!=typeof t)throw new TypeError("callback for docReady(fn) must be a function");o?setTimeout(function(){t(e)},1):(n.push({fn:t,ctx:e}),"complete"===document.readyState?setTimeout(r,1):i||(document.addEventListener?(document.addEventListener("DOMContentLoaded",r,!1),window.addEventListener("load",r,!1)):(document.attachEvent("onreadystatechange",a),window.attachEvent("onload",r)),i=!0))}}("flits_docReady",window),window.flitsApp&&void 0!==window.flitsApp||(window.flitsApp={}),window.flitsApp.formatMoney=function(t,e){"string"==typeof t&&(t=t.replace(".",""));var n="",o=/\{\{\s*(\w+)\s*\}\}/,i=e||"${{amount}}";function r(t,e){return void 0===t?e:t}function a(t,e,n,o){if(e=r(e,2),n=r(n,","),o=r(o,"."),isNaN(t)||null==t)return 0;var i=(t=(t/100).toFixed(e)).split(".");return i[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g,"$1"+n)+(i[1]?o+i[1]:"")}switch(i.match(o)[1]){case"amount":n=a(t,2);break;case"amount_no_decimals":n=a(t,0);break;case"amount_with_comma_separator":n=a(t,2,".",",");break;case"amount_no_decimals_with_comma_separator":n=a(t,0,".",",")}return i.replace(o,n)},window.flitsApp.credit_on_cart=function(){this.that=this,this.get_credit_url="/get_credit",this.apply_credit_url="/credit/apply_credit",this.div_code_class="flits-credit-code-div",this.flits_token="",this.customer_url="",this.cart_data={},this.get_ajax_obj=function(){return window.XMLHttpRequest?new XMLHttpRequest:window.ActiveXObject?new ActiveXObject("Microsoft.XMLHTTP"):void 0},this.set_automatic_code=function(){["input[name='checkout']","button[name='checkout']","[href$='checkout']"].forEach(function(t){var e=document.querySelectorAll(t);if("object"==typeof e&&e)for(var n=0;n<e.length;n++){var o=e[n];if("function"!=typeof o.addEventListener)return;var i=document.getElementById("flits-cart-automatic-code").children[0].cloneNode(!0);o.parentElement.insertBefore(i,o.parentElement.firstChild),o.addEventListener("click",function(t){window.flitsApp.credit_on_cart_obj.get_discount_code(t,this)},!1)}})},this.serialize=function(t){var e=[];for(var n in t)if(t.hasOwnProperty(n))if("object"==typeof t[n]||"array"==typeof t[n])for(var o in t[n])e.push(encodeURIComponent(n+"["+o+"]")+"="+encodeURIComponent(t[n][o]));else e.push(encodeURIComponent(n)+"="+encodeURIComponent(t[n]));return e.join("&")},this.parseHTML=function(t){if(!t)return document.createElement("div");var e=document.createElement("html");return e.innerHTML="<html><head><title>titleTest</title></head><body><div>"+t+"</div></body></html>",e.querySelector("body div")},this.generate_code=function(t){var e="$ {{ amount }}";document.querySelector("#flits-shop-money-format")&&(e=document.querySelector("#flits-shop-money-format").value);var n=t.total_credits,o=t.rules,i="";o.length>0&&(i+="<select name='flits-want-to-use-credit'><option value='-1'>"+window.flitsApp.multilang_cart.spent_rules.select_store_credit_option+"</option>");for(var r=0;r<o.length;r++){var a=o[r].applicable_credits,c=o[r].rule.id,s="You can use ##credits## credits out of ##total_credits##.";switch(o[r].rule.rule.column.name){case"cart_value":s=(s=window.flitsApp.multilang_cart.spent_rules.credit_cart_percentage.replace("##credits##",window.flitsApp.formatMoney(Math.abs(a),e).replace(/((\,00)|(\.00))$/g,""))).replace("##total_credits##",window.flitsApp.formatMoney(Math.abs(n),e).replace(/((\,00)|(\.00))$/g,""));break;default:s=(s=s.replace("##credits##",window.flitsApp.formatMoney(Math.abs(a),e).replace(/((\,00)|(\.00))$/g,""))).replace("##total_credits##",window.flitsApp.formatMoney(Math.abs(n),e).replace(/((\,00)|(\.00))$/g,""))}i+="<option value='"+c+"'>"+s+"</option>"}return o.length>0&&(i+="</select>"),this.parseHTML(i)},this.get_code=function(t){var e=window.flitsApp.credit_on_cart_obj,n=e.customer_url+e.get_credit_url,o=e.get_ajax_obj();o.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var t=JSON.parse(this.responseText);if("0"==t.is_credit_on_cart)return;for(var n=e.generate_code(t.code),o=document.querySelectorAll("."+e.div_code_class),i=0;i<o.length;i++)o[i].append(n.cloneNode(!0))}},o.open("POST",n,!0),o.setRequestHeader("Content-type","application/x-www-form-urlencoded"),Object.defineProperty(t,"cart_token",Object.getOwnPropertyDescriptor(t,"token")),delete t.token;for(var i=["product_description","title","url","handle","product_type","product_title"],r=0;r<t.items.length;r++)for(var a=0;a<i.length;a++)e.isNull(t.items[r][i[a]])||delete t.items[r][i[a]];var c=e.serialize({token:e.flits_token,cart:btoa(unescape(encodeURIComponent(JSON.stringify(t))))});o.send(c)},this.init=function(){this.customer_url=document.getElementById("flits-customer-url").value,this.flits_token=document.getElementById("flits-token").value,this.apply_credit_url=this.customer_url+this.apply_credit_url;var t=0;document.getElementById("flits-is-cart-automatic")&&(t=document.getElementById("flits-is-cart-automatic").value),1==t&&this.set_automatic_code(),this.getCartData(this.get_code,function(){console.error("cannot get cart data")})},this.getCookie=function(t){for(var e=t+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var i=n[o];" "==i.charAt(0);)i=i.substring(1);if(0==i.indexOf(e))return i.substring(e.length,i.length)}return""},this.getCartData=function(t,e){var n=this.get_ajax_obj();n.onreadystatechange=function(){if(4==this.readyState)if(200==this.status){if("function"==typeof t){var n=JSON.parse(this.responseText);t(n)}}else"function"==typeof e&&e()},n.open("GET","/cart.json",!0),n.send()},this.get_discount_code=function(t,e){var n=this,o=!1,i=e.closest("form").querySelector("[name='flits-want-to-use-credit']"),r=-1;if((o=!i||"select"!=i.tagName.toString().toLowerCase())&&i.checked)t.preventDefault();else{if(o||"-1"===i.value)return!0;r=i.value,t.preventDefault()}var a=e.innerHTML,c=window.flitsApp.multilang.applying_credit_message;"input"==e.tagName.toString().toLowerCase()?(a=e.value,e.value=c):(a=e.innerHTML,e.innerHTML=c),e.setAttribute("disabled",!0),n.getCartData(function(t){var o="/credit/apply_credit",i=document.getElementById("flits-token").value;o=document.getElementById("flits-customer-url").value+o;var c=n.get_ajax_obj();c.onreadystatechange=function(){if(4==this.readyState&&200==this.status){var t=JSON.parse(this.responseText);"input"==e.tagName.toString().toLowerCase?e.value=a:e.innerHTML=a,e.setAttribute("disabled",!1),t.status&&(location.href="/checkout?discount="+t.code)}},c.open("POST",o,!0),c.setRequestHeader("Content-type","application/x-www-form-urlencoded"),Object.defineProperty(t,"cart_token",Object.getOwnPropertyDescriptor(t,"token")),delete t.token;for(var s=["product_description","title","url","handle","product_type","product_title"],d=0;d<t.items.length;d++)for(var l=0;l<s.length;l++)n.isNull(t.items[d][s[l]])||delete t.items[d][s[l]];var u="token="+i+"&data="+btoa(unescape(encodeURIComponent(JSON.stringify(t))))+"&spent_rule_id="+r;c.send(u)},function(){location.href="/checkout"})},this.isNull=function(t){return void 0===t||null==t||""==t.toString().trim()},this.add_click_event=function(){$(document).on("click",'[name="checkout"]',function(t){window.flitsApp.credit_on_cart_obj.get_discount_code(t,this)})},this.init()},flits_docReady(function(){window.flitsApp.credit_on_cart_obj=new window.flitsApp.credit_on_cart});
//---------------------------------------

// Show notification using bootstrap alers

function alert(message) {
  const divID = document.getElementById('div_AlertPlaceholder')

  const wrapper = document.createElement('div')
  wrapper.innerHTML = [
    `<div class="alert alert-warning alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
  ].join('')

  divID.append(wrapper)
}


/////////////// helper function

function _get_company_value(key) {
  default_data = {
    'company_name': "DEVNODES ENTERPRISES",
    'company_address': "Chennai, \n Tamil Nadu, India.",
    'company_website': "https://devnodes.in",
    'company_tel': "987654321",
    'company_email': "youremail@domain.com",
  }

  if (localStorage.getItem(key) === null) {
    value = default_data[key];
    localStorage[key] = value;
  } else {
    value = localStorage[key];
  }
  return value;
}

function helper_update_company_info_invoice() {

  var data = {
    'name': _get_company_value('company_name'),
    'address': _get_company_value('company_address'),
    'website': _get_company_value('company_website'),
    'tel': _get_company_value('company_tel'),
    'email': _get_company_value('company_email'),
  };

  document.getElementById('companyName').value = data['name'];
  document.getElementById('companyAddress').value = data['address'];
  document.getElementById('companyWebsite').value = data['website'];
  document.getElementById('companyTel').value = data['tel'];
  document.getElementById('companyEmail').value = data['email'];

  return data;
}

function helper_update_company_info_header() {

  var data = {
    'name': _get_company_value('company_name'),
    'address': _get_company_value('company_address'),
    'website': _get_company_value('company_website'),
    'tel': _get_company_value('company_tel'),
    'email': _get_company_value('company_email'),
  };
  console.log("updated header company info");
  console.log(data);
  document.getElementById('header_companyName').innerHTML = data['name'];
  document.getElementById('header_companyAddress').innerHTML = data['address'];
  document.getElementById('header_companyWebsite').innerHTML = data['website'];
  document.getElementById('header_companyTel').innerHTML = data['tel'];
  document.getElementById('header_companyEmail').innerHTML = data['email'];

  return data;
}

function helper_update_invoice_prefix() {
  var invoice_prefix = "";
  if (localStorage.getItem("invoice_prefix") === null) {
    const today = new Date();
    invoice_prefix = 'DE' + today.getFullYear();
  } else {
    invoice_prefix = localStorage['invoice_prefix'];
  }
  document.getElementById('invoice_prefix').value = String(invoice_prefix);
}

function helper_update_invoice_no() {
  var invoice_no = parseInt(localStorage['invoice_no'], 10);
  if (isNaN(invoice_no)) {
    invoice_no = 0;
  }

  invoice_no += 1; // increment 1
  document.getElementById('invoice_no').value = String(invoice_no).padStart(5, '0'); // '009';
}

function helper_update_invoice_date() {
  const today = new Date();
  document.getElementById('invoice_date').value = today.toISOString().substring(0, 10);
}

function helper_logo_upload(image) {
  console.log("Uploading image");
  const reader = new FileReader();

  reader.readAsDataURL(image);

  reader.addEventListener('load', () => {
    localStorage.setItem('company_logo', reader.result);
  });

  alert("<b>Image uploaded,</b> refresh the page for update");
}

function helper_logo_load_header() {
  const logo = localStorage.getItem('company_logo');
  const id_logo_header = document.getElementById('header_companyLogo');
  
  if (logo) {
    console.log("Heading Logo: Custom");
    id_logo_header.setAttribute('src', logo);
    } else {
      console.log("Heading Logo: Default");
    id_logo_header.setAttribute('src', 'logo.png');
    }
}

function helper_logo_load_invoice() {
  const logo = localStorage.getItem('company_logo');
  const id_logo_header = document.getElementById('InvoiceLogo');
  
  if (logo) {
    console.log("Heading Logo: Custom");
    id_logo_header.setAttribute('src', logo);
    } else {
      console.log("Heading Logo: Default");
    id_logo_header.setAttribute('src', 'logo.png');
    }
}

/////////////// action hanlers 

function action_modal_settings_clear(event) {
  // clear local storage
  localStorage.clear();
  document.getElementById('bill_to').value = "-";
  document.getElementById('ship_to').value = "-";
  location.reload();
}

function action_invoice_new(event) {
  //reload the page
  document.getElementById('bill_to').value = "-";
  document.getElementById('ship_to').value = "-";
  location.reload();
}

/////////////// modal form submit handler 

function action_submit_modal_logo(event) {
  // Prevent the form from submitting normally.
  event.preventDefault();

  // Close the modal.
  $('#settingsModal').modal('hide');

  // Return true to indicate that the form submission was successful.
  return true;
}

function action_submit_modal_settings(event) {
  // Prevent the form from submitting normally.
  event.preventDefault();

  var name = document.getElementById('companyName').value;
  var address = document.getElementById('companyAddress').value;
  var website = document.getElementById('companyWebsite').value;
  var tel = document.getElementById('companyTel').value;
  var email = document.getElementById('companyEmail').value;

  localStorage.setItem("company_name", name);
  localStorage.setItem("company_address", address);
  localStorage.setItem("company_website", website);
  localStorage.setItem("company_tel", tel);
  localStorage.setItem("company_email", email);

  // Close the modal.
  $('#settingsModal').modal('hide');

  alert("<b>Settings updated,</b> refresh page for updates");

  // Return true to indicate that the form submission was successful.
  return true;
}

/////////////// form submit handler 

function action_submit_invoice_preview(event) {
  event.preventDefault(); // Prevent the form from submitting

  var form = event.target; // Get the form element
  var formData = new FormData(form); // Create a new FormData object

  // Convert the FormData object to an array
  var submittedArray = Array.from(formData.entries());

  // Group the submitted array by name
  var groupedData = submittedArray.reduce(function (result, item) {
    if (!result[item[0]]) {
      result[item[0]] = [];
    }
    result[item[0]].push(item[1]);
    return result;
  }, {});

  count = groupedData["name"].length;
  data = [];
  subtotal = 0.00;
  total_saving = 0.00;
  total_gst = 0.00;
  for (i = 0; i < count; i++) {
    incTax = (groupedData["incTax"][i] === '1')
    mrp = parseFloat(groupedData["mrp"][i]);
    rate = parseFloat(groupedData["rate"][i]);
    discount = ((mrp - rate) / mrp) * 100;
    gst_p = parseInt(groupedData["gst"][i]);
    rate_w_gst = (rate + (rate * (gst_p / 100)));
    qty = parseFloat(groupedData["qty"][i]);
    total = incTax ? (rate * qty).toFixed(2) : (rate_w_gst * qty).toFixed(2);
    row = {
      'name': groupedData["name"][i],
      'hsn': groupedData["hsn"][i],
      'mrp': mrp ? mrp.toFixed(2) : 0,
      'rate': incTax ? rate.toFixed(2) : rate_w_gst.toFixed(2),
      'discount': Math.round(discount),
      'qty': qty,
      'unit': groupedData["unit"][i],
      'gst': gst_p,
      'total': total,
      'incTax': incTax ? 'Inc GST' : 'Exc GST',
    };
    data.push(row);

    if (mrp) {
      total_saving += (mrp - rate) * qty;
    }
    total_gst += total - (total / (1 + (gst_p / 100)));
    subtotal += parseFloat(total);
  }

  const bill_type = {
    'bil': "BILL",
    'inv': "INVOICE",
    'est': "ESTIMATE",
    'emp': "",
  };

  localStorage['invoice_no'] = parseInt(groupedData["invoice_no"], 10);
  localStorage['invoice_prefix'] = groupedData["invoice_prefix"];

  var invoice_id = groupedData["invoice_prefix"] + groupedData["invoice_no"];

  if (isNaN(total_saving)) total_saving = 0;

  json_data = {
    "type": bill_type[groupedData["type"]],
    "company": helper_update_company_info_invoice(),
    "date": groupedData["invoice_date"],
    "invoice_id": invoice_id,
    "bill_to": groupedData["bill_to"][0],
    "items": data,
    "subtotal": subtotal.toFixed(2),
    "total_gst": total_gst.toFixed(2),
    "total_saving": total_saving.toFixed(2),
  };

  if (groupedData["ship_to"][0].length)
    json_data["ship_to"] = groupedData["ship_to"][0];

  if (groupedData["notes"][0].length)
    json_data["notes"] = groupedData["notes"][0]

  console.log(json_data);

  template_invoice_create(json_data);

  //finally show the download button. 
  document.getElementById("download").className = "visible";

  helper_logo_load_invoice();
}

/////////////////// Export div to png

function action_invoice_download() {
  // Get the div element.

  const div = document.getElementById("invoice_output");
  const invoice_prefix = document.getElementById('invoice_prefix').value;
  const invoice_no = document.getElementById('invoice_no').value;
  const filename = invoice_prefix + invoice_no + ".jpg";
  html2canvas(div).then(function (canvas) {
    var element_link = document.createElement("a");
    document.body.appendChild(element_link);
    //document.getElementById("previewImg").appendChild(canvas);
    element_link.download = filename;
    element_link.href = canvas.toDataURL();
    element_link.target = '_blank';
    element_link.click();
  });
}

////////////////////////// Action hooks
function action_live_edit(event, id){
  event.preventDefault(); // Prevent the form from submitting
  console.log("action_live_edit");
  console.log(event);
  console.log(id);
}
function action_invoice_row_delete(event) {
  // Get the current row
  const currentRow = event.target.closest("tr");

  // Remove the row from the table
  currentRow.remove();
}

function action_invoice_add_row() {
  const template_table_row = `
  <tr>
    <td style="width: 20px;"><button type="button" id="deleteRow" class="btn btn-link fw-bold link-danger text-decoration-none" onclick="return action_invoice_row_delete(event)"><i title="Remove item" class="bi bi-x-circle-fill"></i></button></td>
    <td colspan="2"><input type="text" name="name" value="Tiles" required style="width: 100%;"></td>
    <td><input type="number" name="hsn" value="69072100" style="width: 80px;"></td>
    <td><input type="number" name="mrp" value="125" style="width: 80px;"></td>
    <td><input type="number" name="rate" value="100" required style="width: 80px;"></td>
    <td>
      <input type="number" name="qty" value="1" required style="width: 80px;">
      <select name="unit">
        <option value="nos" selected>nos</option>
        <option value="pcs">pcs</option>
        <option value="box">box</option>
        <option value="pack">pack</option>
        <option value="rolls">rolls</option>
        <option value="sqft">sqft</option>
        <option value="ft">ft</option>
        <option value="kg">kg</option>
        <option value="liter">liter</option>
        <option value="ton">ton</option>
      </select>
    </td>
    <td><input type="number" name="gst" value="18" required style="width: 80px;">
    <select name="incTax">
      <option value="1" selected>Inc</option>
      <option value="0">Exc</option>
    </select>
    </td>
  </tr>
  `;
  // compile the template
  var output = Handlebars.compile(template_table_row);
  $('#invoice_form').append(output);
  console.log("form");
}

function template_invoice_create(json_data) {
  const template_table_header = `
  <tr>
    <td class="text-end border border-dark border-end-0 text-center">
      <img id="InvoiceLogo" src="logo.png" width="300" height="150">
    </td>
    <td colspan="3" class="border border-dark border-start-0">
      <b>{{company.name}}</b><br> 
      {{company.address}}<br>
      <b>TEL:</b> {{company.tel}}<br>
      {{#if company.email}}<b>E-Mail:</b> {{company.email}}{{/if}}<br>
      {{#if company.website}}<b>Web:</b> {{company.website}}{{/if}}
    </td>
  </tr>
  <tr>
    <td colspan="2">
      <b>No:</b> {{invoice_id}}<br>
      <b>Order Date:</b> {{date}}
    </td>
    <td colspan="2"><h1>{{type}}</h1></td>
  </tr>
  <tr>
    <th colspan="2" style="width: 50%;">Billing To</th>
    <th colspan="2">{{#if ship_to}} Shipping To {{/if}}</th>
  </tr>
  <tr>
    <td colspan="2">{{bill_to}}</td>
    <td colspan="2">{{#if ship_to}} {{ship_to}} {{/if}}</td>
  </tr>`;

  const template_table_row = `
  <tr>
    <th style="width: 40%;">Name</th>
    <th class="td-center td-100">MRP</th>
    <th class="td-center td-100">Rate <small>(GST.inc.)</small></th>
    <th class="td-center td-100">Qty</th>
    <th class="td-center td-100">GST</th>
    <th class="td-right td-100">Total</th>
  </tr>
  {{#each items}}
  <tr>
    <td>{{name}} <br>
      {{#if hsn}}<small>HSN/SAC: {{hsn}}</small>{{/if}} 
      {{#if mrp}}, <b class="text-danger">[{{discount}}% Discount]</b>{{/if}}
    </td>
    <td class="td-center">{{#if mrp}}₹{{mrp}}{{/if}}</td>
    <td class="td-center">₹{{rate}}</td>
    <td class="td-center">{{qty}} {{#if unit}}{{unit}}{{/if}}</td>
    <td class="td-center">{{#if gst}}{{gst}}%{{/if}}</td>
    <td class="td-right">₹{{total}}</td>
  </tr>
  {{/each}}`;

  const template_table_footer = `
  <tr class="fw-bold fs-5">
    <td colspan="4"></td>
    <td class="border border-dark td-right">Total</td>
    <td class="border border-dark td-right">₹{{subtotal}}</td>
  </tr>
  <tr class="fs-6">
    <td colspan="4"></td>
    <td class="border border-dark td-right">GST (inc.)</td>
    <td class="border border-dark td-right">₹{{total_gst}}</td>
  </tr>
  {{#if total_saving}}
  <tr class="fw-bold text-danger fs-6">
    <td colspan="4"></td>
    <td class="border border-dark td-right">Total Savings</td>
    <td class="border border-dark td-right">₹{{total_saving}}</td>
  </tr>
  {{/if}}
  <tr>
    <td colspan="7" class="border border-dark">
    {{#if notes}}<strong>Note:</strong><br>{{notes}}<br>{{/if}}
    <strong>Terms & Conditions:</strong><br>
    - Dispatch: 2-15 working days from the date of payment<br>
    - Payment Terms: 100% Advance<br>
    - Transport: Exclusive (Buyer Scope)<br>
    - Unloading Charges: Exclusive (Buyer Scope)<br>
    - Price Validity: 2 working days<br>
    - Tolerance: ± 0.5% for Weight, ± 5% for thickness & Qty is acceptable.<br>
    </td>
  </tr>`;


  // compile the template
  $('#invoice_header').html("");
  var output = Handlebars.compile(template_table_header)(json_data);
  $('#invoice_header').append(output);
  $('#invoice').html("");
  var output = Handlebars.compile(template_table_row)(json_data);
  $('#invoice').append(output);
  output = Handlebars.compile(template_table_footer)(json_data);
  $('#invoice').append(output);
}

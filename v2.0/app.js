//---------------------------------------

// Show notification using bootstrap alert

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

function read_data_string(id) {
  var value = localStorage.getItem(id);
  if (value === null) {
    value = document.getElementById(id).defaultValue;
  }
  document.getElementById(id).value = String(value);
}


function form_init() {

  const today = new Date();
  document.getElementById('invoice_date').value = today.toISOString().substring(0, 10);

  var invoice_prefix = localStorage.getItem("invoice_prefix");
  if (invoice_prefix === null) {
    prefix_year_month = (((new Date()).getFullYear() % 100) * 100) + ((new Date()).getMonth() + 1);
    invoice_prefix = (invoice_prefix === null) ? ('DE' + prefix_year_month) : localStorage['invoice_prefix'];
  }
  document.getElementById('invoice_prefix').value = String(invoice_prefix);


  var invoice_no = parseInt(localStorage.getItem('invoice_no'), 10);
  invoice_no = isNaN(invoice_no) ? 1 : ++invoice_no;
  document.getElementById('invoice_no').value = String(invoice_no).padStart(2, '0'); // '009';

  read_data_string('company_name');
  read_data_string('company_addr');

  var theme = parseInt(localStorage.getItem('theme'), 10);
  if (isNaN(theme)) {
    document.getElementById('option_dark_mode').checked = false;
    localStorage.setItem('theme', 0);
    theme = 1;
  } 
  action_theme_change(theme);

}

function action_theme_change(status) {

  var theme = (status) ? "dark" : "light";

  const rootElement = document.documentElement;
  rootElement.setAttribute("data-bs-theme", theme);

  localStorage.setItem('theme', status);
  document.getElementById('option_dark_mode').checked  = (status) ? true : false;
}

function action_clear_data(event, id) {
  //reload the page
  event.preventDefault(); // Prevent the form from submitting
  document.getElementById(id).value = "";
  localStorage.removeItem(id);
  console.log("action_clear_data() :" + id);
  location.reload();
}

function action_invoice_new(event) {
  //reload the page
  document.getElementById('inputBillTo').value = "-";
  invoice_no = document.getElementById('invoice_no').value;
  localStorage['invoice_no'] = parseInt(invoice_no, 10);
  console.log(invoice_no);
  location.reload();
}

function action_invoice_row_delete(event) {
  // Get the current row
  const currentRow = event.target.closest("#item-row");

  // Remove the row from the table
  currentRow.remove();
}



function action_invoice_add_row(add_item) {
  console.log(add_item);

  const template_table_row = `
  <div id="item-row" class="d-flex flex-column flex-md-row mb-3 border-bottom">
    <div class="d-flex flex-row flex-md-row-reverse flex-fill">
      <div class="d-flex flex-column mb-3 flex-fill">
        <input type="text" name="name" class="form-control" value="${add_item}" autocomplete="off" required>
        <textarea name="desc" type="text" class="form-control" placeholder="Description.." rows="1">12G (2.50mm) - 3x3/5ft x 100ft</textarea>
      </div>
      <div>
        <button type="button" id="deleteRow" class="btn btn-link fw-bold link-danger text-decoration-none" onclick="return action_invoice_row_delete(event)"><i title="Remove item" class="bi bi-x-circle"></i></button>
      </div>
    </div>
    <div class="d-flex flex-row flex-wrap">
      <div class="ms-md-2">
        <div class="input-group mb-1" style="width: 130px;">
          <span class="input-group-text fw-semibold">Qty</span>
          <input name="qty" type="number" value="1" step="0.01" class="form-control">
        </div>
        <div class="input-group mb-1" style="width: 130px;">
          <span class="input-group-text fw-semibold">Unit</span>
          <select name="unit" class="form-select">
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
        </div>      
      </div>
      
      <div class="ms-2">
        <div class="input-group mb-1" style="width: 130px;">
          <span class="input-group-text fw-semibold">MRP</span>
          <input type="number" name="mrp" value="0" step="0.01" class="form-control">
        </div>
        <div class="input-group mb-3" style="width: 130px;">
          <span class="input-group-text fw-semibold">Rate</span>
          <input type="number" name="rate" value="0" step="0.01" class="form-control" required>
        </div>
      </div>

      <div class="ms-md-2">
        <div class="input-group mb-1" style="width: 130px;">
          <span class="input-group-text fw-semibold">Tax %</span>
          <input type="number" name="tax" value="18" class="form-control">
        </div>
      </div>
    
    </div>
    
  
  </div>
  `;


  // compile the template
  var output = Handlebars.compile(template_table_row);
  $('#inputProductItem').append(output);
}


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
  console.log(formData);
  console.log(groupedData);

  data = [];
  subtotal = 0.00;
  total_saving = 0.00;
  total_gst = 0.00;

  for (i = 0; i < count; i++) {
    incTax = ("option_inc_tax" in groupedData) ? 1 : 0;
    mrp = parseFloat(groupedData["mrp"][i]);
    rate = parseFloat(groupedData["rate"][i]);
    discount = ((mrp - rate) / mrp) * 100;
    gst_p = parseInt(groupedData["tax"][i]);
    rate_w_gst = (rate + (rate * (gst_p / 100)));
    qty = parseFloat(groupedData["qty"][i]);
    total = incTax ? (rate * qty).toFixed(2) : (rate_w_gst * qty).toFixed(2);
    row = {
      'name': groupedData["name"][i],
      'desc': groupedData["desc"][i],
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

  console.log(data);

  const bill_type = {
    'bil': "BILL",
    'inv': "INVOICE",
    'est': "ESTIMATE",
    'emp': "",
  };

  var invoice_id = groupedData["invoice_prefix"] + groupedData["invoice_no"];

  if (isNaN(total_saving)) total_saving = 0;

  json_data = {
    "type": bill_type[groupedData["type"]],
    "company_name": groupedData["company_name"],
    "company_addr": groupedData["company_addr"],
    "date": groupedData["date"],
    "invoice_id": invoice_id,
    "bill_to": groupedData["bill_to"][0],
    "items": data,
    "subtotal": subtotal.toFixed(2),
    "total_gst": total_gst.toFixed(2),
    "total_saving": total_saving.toFixed(2),
  };

  if (groupedData["terms"][0].length)
    json_data["terms"] = groupedData["terms"][0]

  console.log(json_data);

  document.getElementById("download").className = "visible";

  template_invoice_create(json_data);

  document.getElementById("invoice_output").scrollIntoView();

  /* Finally: Save the value */
  localStorage.setItem('invoice_no', parseInt(groupedData["invoice_no"], 10));
  localStorage.setItem('invoice_prefix', groupedData["invoice_prefix"]);
  localStorage.setItem('company_name', groupedData["company_name"]);
  localStorage.setItem('company_addr', groupedData["company_addr"]);
}

function template_invoice_create(json_data) {
  const template_table_header = `
  <div class="col-12 border border-secondary border-2 border-bottom-0 text-center py-2">
    <span class="fw-bold fs-5">{{company_name}}</span><br>
    {{nl2br company_addr}}
  </div>
  <div class="col-6 border border-secondary border-2">
    <strong>No :</strong> {{invoice_id}}<br>
    <strong>Date :</strong> {{date}}
  </div>
  <div class="col-6 border border-secondary border-2 border-start-0 text-center">
    <h1>{{type}}</h1>
  </div>
  <div class="col-12 border border-secondary border-2 border-top-0 fw-bold">
    Bill To :
  </div>
  <div class="col-12 border border-secondary border-2 border-top-0">
    {{nl2br bill_to}}
  </div>
  `;

  const template_table_row = `
  <div class="col-6 border border-secondary border-2 border-top-0 border-end-0 fw-bold">
    Name
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 border-end-0 text-center fw-bold">
    Price
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 border-end-0 text-center fw-bold">
    Qty
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 text-center fw-bold">
    Total
  </div>

  {{#each items}}
  <div class="col-6 border border-secondary border-2 border-top-0 border-end-0">
    <span class="fw-semibold">{{name}}</span><br>
    <span>{{desc}}</span>
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 border-end-0 text-center fw-semibold">
    {{#if mrp}}<s class="text-danger">₹{{mrp}}</s><br>{{/if}}
    ₹{{rate}}
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 border-end-0 text-center fw-semibold">
    {{qty}} {{#if unit}}{{unit}}{{/if}}
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 text-center fw-semibold">
    ₹{{total}}
  </div>
  {{/each}}
  `;

  const template_table_footer = `
  <div class="col-8 border border-secondary border-2 border-top-0 border-end-0">
  
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 border-end-0 fw-bold text-center fs-5">
    Total
  </div>
  <div class="col-2 border border-secondary border-2 border-top-0 fw-bold text-center">
    ₹{{subtotal}}
  </div>
  <div class="col-12 border border-secondary border-2 border-top-0">
    {{#if notes}}<strong>Note:</strong><br>{{nl2br notes}}<br>{{/if}}
    {{#if terms}}
    <strong>Terms & Conditions:</strong><br>
      {{nl2br terms}}
    {{/if}}
  </div>
  `;

  Handlebars.registerHelper('nl2br', function (text, isXhtml) {
    const breakTag = isXhtml ? '<br />' : '<br>'
    const withBr = Handlebars.escapeExpression(text).replace(
      /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g,
      '$1' + breakTag + '$2'
    )
    return new Handlebars.SafeString(withBr)
  })

  // compile the template
  $('#invoice_header').html("");
  var output = Handlebars.compile(template_table_header)(json_data);
  $('#invoice_header').append(output);
  $('#invoice_body').html("");
  var output = Handlebars.compile(template_table_row)(json_data);
  $('#invoice_body').append(output);
  output = Handlebars.compile(template_table_footer)(json_data);
  $('#invoice_body').append(output);
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

function update_company_settings() {
  /**
   * Edit below values to change company name and address
   */
  console.log("update_company_settings");
  document.getElementById('company_name').value = "DEVNODES.IN";
  document.getElementById('company_addr').value = `India. PIN - 654321.
  TEL: 987654321, Email: support@example.in
  Website: www.devnodes.in 
`;
}

function get_product_description(item) {
  json = { 
    "Apple iPhone 11": { title: "Apple iPhone 11", desc: "128GB, Green" },
    "Apple iPhone 12": { title: "Apple iPhone 12", desc: "128GB, Blue" },
    "Apple iPhone 13": { title: "Apple iPhone 13", desc: "128GB, Pink" },
    "Apple iPhone 14": { title: "Apple iPhone 14", desc: "128GB, Black" },
    "Apple iPhone 15": { title: "Apple iPhone 15", desc: "128GB, Yellow" },
  };

  ret = (item in json)? json[item] : ({title: item, desc: ""});
  return ret;
}

function login_enabled() {
  return false; // set it true to enable it. 
}

function login_user() {
  return 'devnodes'; // set it true to enable it. 
}

function login_pass() {
  return 'devnodes'; // set it true to enable it. 
}
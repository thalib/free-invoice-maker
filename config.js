
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
    "Chain Link Fence": { title: "TATA Chain Link Fence", desc: "12G (2.50mm) - 3x3/5ft x 100ft" },
    "Knotted Fence": { title: "TATA Knotted Fence", desc: "Tata Wiron 12G (2.50mm) - 5ft x 100ft" },
    "Stambh Post": { title: "TATA Stambh Post - 7ft", desc: "Bituminous coated" },
    "Wiron GI Wire": { title: "TATA Wiron GI Wire", desc: "16G (1.60mm)" },
    "Barbed Wire": { title: "TATA Barbed Wire 12G x 12G (2.50mm x 2.50mm)", desc: "3500 ft x 3 lines = 10500ft ~= 15 coils x 35Kg" },
    "Cool Roof Tiles": { title: "Cool Roof Tiles - 300x300mm (Heavy Duty)", desc: "Grade: Premium, 8mm Thickness, Floor Body, Glossy Finish" },
    "Swimming Pool Tiles": { title: "Swimming Pool - 300x300mm (Heavy Duty)", desc: "Grade: Premium, 8mm Thickness, Floor Body, Glossy Finish" },
    "MS Pipe": { title: "M.S. Pipe 50x50mm, Thickness 2.90mm", desc: "Grade 2, Length: 6M, (35.33 Kg/Length) (100 Qty)" },
    "GI Pipe": { title: "G.I. Pipe 50x50mm, Thickness 2.90mm", desc: "Grade 2, Length: 6M, (35.33 Kg/Length) (100 Qty)" },
    "GI Pipe (Round)": { title: 'G.I. Pipe 12" (300mm)', desc: 'Grade 2, Nominal Bore: 300mm (12"), OD 323.90, Thickness: 4.00mm, Length: 6M, Weight: 201 Kg/Length (1000 Qty)' },
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
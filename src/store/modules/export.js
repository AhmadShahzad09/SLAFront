import * as XLSX from "xlsx/xlsx";

// initial state
const state = () => ({});

// getters
const getters = {};

// mutations
const mutations = {
  downloadEXCEL(state, data) {
    const ws = data.sheetName ? XLSX.utils.aoa_to_sheet([ [ `${data.name}${data.sheetName ? '(' + data.sheetName + ')': ''}` ]]) : XLSX.utils.json_to_sheet(data.data);
    
    if(data.sheetName) {
      XLSX.utils.sheet_add_json(ws, data.data,{origin: "A2"});
    }
    

    //  XLSX.utils.json_to_sheet();
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, data.sheetName ? data.sheetName : "Data");
    if(data.type === "xlsx") {
      XLSX.writeFile(wb, `${data.name}.xlsx`);
    } else {
      XLSX.utils.sheet_to_csv(wb);
      XLSX.writeFile(wb, `${data.name}${data.sheetName ? '(' + data.sheetName + ')': ''}.csv`);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
};

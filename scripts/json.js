const list = require('../api/json/full_company_list.json') ;
const fs = require('fs') ;
const final_data = list.map(company => {
    return {
        ...company,
        YFSymbol: company.YFSymbol.includes('.NS') ? company.YFSymbol : `${company.YFSymbol}.NS`
    }
}) ;

fs.writeFileSync('full_compmany_list.json', JSON.stringify(final_data)) ;

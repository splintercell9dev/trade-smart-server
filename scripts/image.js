const fs = require('fs') ;
let newCompanies = require('../full_company_list.json') ;
const oldCompanies = require('../api/json/full_company_list.json') ;

(async () => {
    newCompanies = newCompanies.map(company => {
        let index = 0 ;
        const x = oldCompanies.some( (c, ind) => {
            index = ind ;
            return c.symbol === company.symbol ;
        }) ;

        return {
            ...company,
            YFSymbol: `${company.YFSymbol}.NS`,
            profileImageUrl: oldCompanies[index].profileImageUrl
        } ;
    }) ;

    fs.writeFileSync('final_list.json', JSON.stringify(newCompanies)) ;
})()
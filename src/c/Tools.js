/**
 * Route: Includes all tools functions here
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:20
 * Email:  Weixing.Sun@Gmail.Com
 */
module.exports = {

    /**
     * Tools: for spliting address name into several lines, will extract to tools class later
     * @param {String} address name
     * @return {Number} the "," index in middle of address
     */
    getMiddleIndex(name){
        let arr = name.split(',')
        let half = arr.length/2
        arr = arr.slice(0, half);
        return arr.join(',').length
    },
}
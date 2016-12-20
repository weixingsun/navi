/**
 * Includes all Network API calls here, alternative modules like RxJS, RNfetch, etc.
 * Project: navi
 * Package: com.navi
 * Author: Weixing Sun on 2016-12-19 10:20
 * Email:  Weixing.Sun@Gmail.Com
 */

module.exports = {
	/**
	 * Network REST api
	 * @param {String} url
	 * @param {JSON} data
	 * @return {JSON} response, in promise
	 */
    async netCmd(url, data) {
      try {
        let response = await fetch(url, data);
        let responseJson = await response.json();
        return responseJson;
      } catch(err) {
        //console.error(err);
        //alert('Network Problem err='+JSON.stringify(err))
        alert('Network Problem')
      }
    },
	/**
	 * Network REST.get api
	 * @param {String} url
	 * @return {JSON} response, in promise
	 */
    _get(url) {
      return this.netCmd(url,{method:'get'});
    },
	/**
	 * Network REST.delete api by url
	 * @param {String} url
	 * @return {JSON} response, in promise
	 */
    _del(url) {
      return this.netCmd(url,{method:'delete'});
    },
	/**
	 * Network REST.delete api by form
	 * @param {String} url
	 * @param {JSON} data
	 * @return {JSON} response, in promise
	 */
    _del_body(url,data) {
      return this.netCmd(url,{
            method:'delete',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
    },
	/**
	 * Network REST.put api by form
	 * @param {String} url
	 * @param {JSON} data
	 * @return {JSON} response, in promise
	 */
    _put(url,data) {
        return this.netCmd(url,{
            method:'put',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
            body: JSON.stringify(data)
        });
    },
	/**
	 * Network REST.post api by form
	 * @param {String} url
	 * @param {JSON} data
	 * @return {JSON} response, in promise
	 */
    _post(url, data) {
      return this.netCmd(url,{
          method:'post',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', },
          body: JSON.stringify(data)
      });
    },
}

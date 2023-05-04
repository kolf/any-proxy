/*
 * @Author: shixiankang shixiankang@vv.cn
 * @Date: 2023-04-11 15:56:15
 * @LastEditors: shixiankang shixiankang@vv.cn
 * @LastEditTime: 2023-04-13 19:35:09
 * @FilePath: /vv-tools/proxy.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// const path = `https://worktest3.vvtechnology.cn/desktop-office`;
const paths = [
  `https://worktest3.vvtechnology.cn/desktop-office`,
  `https://uat.vvtechnology.cn/desktop-office`,
  `https://workdev-business1.vvtechnology.cn/desktop-office`,
];

module.exports = {
  *beforeSendRequest(requestDetail) {
    console.log(requestDetail.url, "requestDetail.url");
    const path = paths.find((p) => requestDetail.url.startsWith(p));
    if (requestDetail.url.startsWith(path)) {
      const newRequestOptions = requestDetail.requestOptions;

      requestDetail.protocol = "http";
      newRequestOptions.hostname = "127.0.0.1";
      newRequestOptions.port = "6333";
      newRequestOptions.path = requestDetail.url.replace(path, "");
      // newRequestOptions.method = 'GET';
      return requestDetail;
    }
  },
  *beforeDealHttpsRequest(requestDetail) {
    return true;
  },
};

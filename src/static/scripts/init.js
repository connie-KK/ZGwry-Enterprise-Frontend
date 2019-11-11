// dingtalk.userinfo().then(function(data){
//     alert(JSON.stringify(data))
// })
dingtalk.request({ url: "https://oapi.dingtalk.com/user/get" }).then(function({data}){
    return data.department
}).then(function(department){
   return dingtalk.request({ url: 'https://oapi.dingtalk.com/department/get', data: { id: department[0] } });
}).then(function(data){
    // alert(JSON.stringify(data))
});


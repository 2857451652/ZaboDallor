import Axios from 'axios'

// 接口地址
const BASE_PATH = ['http://149.129.120.139:9001', 'http://680.org.cn:9001'][0]

// 用户登录
export const login = params => { return Axios.post(`${BASE_PATH}/loginUser`, params).then(res => res.data); };

// 用户注册
export const register = params => { 
    return Axios.post(`${BASE_PATH}/createV2`, params).then(res => res.data); 
};

// 新的申请
export const newapply = params => { 
    return Axios.post(`${BASE_PATH}/createNewProposal`, params, 
    {
        headers:{
            token: localStorage.getItem('token')
        }
    }).then(res => res.data);
};

// 重启请求
export const resetapply = params => { 
    return Axios.post(`${BASE_PATH}/resetProject`, params, 
    {
        headers:{
            token: localStorage.getItem('token')
        }
    }).then(res => res.data);
};

// 重启请求
export const delapply = params => { 
    return Axios.post(`${BASE_PATH}/deleteProject`, params, 
    {
        headers:{
            token: localStorage.getItem('token')
        }
    }).then(res => res.data);
};

//用户信息
export const getUserInfo = params=>{return Axios.get(`${BASE_PATH}/infoUser`,
{
    params:params,
    headers:{ 
        token: localStorage.getItem('token')
    }
}).then(res => res.data);}

// 文件上传
export const uploadFunc = (str, formData, resolve)=> {
    var url = `${BASE_PATH}`+str;
    console.log("uploadFunc")
    Axios({
        url: url,
        method: 'POST',
        data: formData,
        timeout: 0, //无超时
        headers: {
        token: localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
        }
    }).then(res => {
       return  resolve(res.data);
    })
}

//获取文件提交情况
export const getProjectInfo = params=>{return Axios.get(`${BASE_PATH}/projectArray`,
{
    params:params,
    headers:{ 
        token: localStorage.getItem('token')
    }
}).then(res => res.data);}

// 获取用户列表
export const getUserList = params => { return Axios.get(`${BASE_PATH}/user/list`, { params: params }).then(res => res.data); };

// 首页加载数据
export const loadData  = params => { return Axios.get(`${BASE_PATH}/home/loadData`).then(res => res.data) };

// 文件上传地址
export const uploadFile = `${BASE_PATH}/file/upload`;

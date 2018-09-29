
const message = {
    namespaced: true,
    state: {
        messageList:[]
    },
    mutations: {
        SET_messageList: (state, data) => {
            state.messageList = data
        },
        PUSH_messageList:(state, data) => {
            state.messageList.push(data);
        },
        Unshift_messageList:(state, data)=>{
            state.messageList.unshift(data);
        },
    },
    actions: {


    }
}

export default message

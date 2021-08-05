import axios from 'axios';
import { authHeader } from './authHeader';

// TODO: Split the file
// Service file for API call
// Store file to save data on localStorage

// default data value
const state = {
	user: null,
	messages: null
};

// Get localdata
const getters = {
	isAuthenticated: state => !!state.user,
	isAdmin: state => state.user.isAdmin,
	StatePosts: state => state.posts,
	StateUser: state => state.user,
	StateMessages: state => state.messages,
};

// API call
const actions = {

	async Register({dispatch}, user) {
		const newUser = await axios.post('users', user)
		if (newUser)
			await dispatch('LogIn', user)
		return newUser;
	},
	async LogIn({commit}, user) {
		await axios.post('users/singup', user)
		.then((response) => {
			user = response.data.user;
			user.token = response.data.token;
		})
		await commit('setUser', {
			name: user.name, 
			id: user._id,
			isAdmin: user.isAdmin,
			created: user.createdAt,
			token: user.token
		});
	},
	async LogOut({ state, commit}) {
		if (!state.user.isAdmin)
			await axios.delete('users/' + state.user.id )
		commit('LogOut')
	},

	async CreateMessage({ state, dispatch}, msg) {
		await axios.post('messages', msg);
		await dispatch('GetMessages', state.user.id)
	},
	async GetMessages({ state, commit }, userId){
		let response = await axios.get('messages/' + userId)
		commit('setMessages', response.data)
	},
	async GetAllMessages({ state, commit }){
		let response = await axios.get('messages/', {headers: authHeader() })
		console.log('GetAllMessages', response);
		commit('setMessages', response.data)
	},

};

// Changes of our local data
const mutations = {
	setUser(state, user){
		console.log('auth.js mutations - setUser', user);
		state.user = user
	},
	LogOut(state){
		console.log('auth.js mutations - LogOut');
		state.user = null
		state.messages = null
	},

	setMessages(state, messages){
		for (var i in messages) {
		  if (messages[i].participantId == state.user.id)
		  	messages[i]['myself'] = true;
		  else
		  	messages[i]['myself'] = false;

		  messages[i].timestamp = messages[i].createdAt;
		}
		state.messages = messages;
	}

};

export default {
	state,
	getters,
	actions,
	mutations
};
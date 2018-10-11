import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        current_list_item: null,
    },
    mutations: {
        current_list_item_mutations(state, item) {
            state.current_list_item =item;
        },



    },
    actions: {},
    modules: {}
});

export default store;

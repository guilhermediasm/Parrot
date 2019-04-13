
import { AsyncStorage } from 'react-native';

import {
    LISTA_CONVERSA
} from '../actions/types';

export const loadDataStore = () => {
    try {
        return (dispatch) => {
            AsyncStorage.getItem('Conversas').then((value) => {
                const data = JSON.parse(value)
                dispatch({
                    type: LISTA_CONVERSA,
                    payload: data
                })
            })
        }
    }
    catch (err) {
        alert('Erro no carregamento das conversas', err)
        return undefined
    }
}

export const persistirConversa = async (type, texto) => {
    try {
        AsyncStorage.getItem('Conversas').then((value) => {
            if (value !== null) {
                var vl = JSON.parse(value)
                vl = vl.concat({ type, texto })
                AsyncStorage.setItem('Conversas', JSON.stringify(vl))

            } else {
                var conversas = { conversa: [{ type, texto }] }
                AsyncStorage.setItem('Conversas', JSON.stringify(conversas.conversa))
            }
        })
    } catch (error) {
        alert('Erro em persistir mensagem', error)
    }

}
import { createSlice } from '@reduxjs/toolkit'


const initialState ={
    loading : false,
    error: null,
    products: [''],
    product: ' '
}

const productSlice = createSlice({
    
    name:"products",
    initialState,
    reducers:{
              setLoading : (state)=>{
                         state.loading= true
              },
             setProducts :(state , {payload})=>{
                         state.products= payload //[]
                         state.loading=false
             },
             setProduct :(state , {payload})=>{
                         state.product= payload//{} id
                         state.loading=false
             }
    }

})

export const {setLoading, setProducts, setProduct}= productSlice.actions   ///--------> to prodactions

export default productSlice.reducer; ////-------->to store.js
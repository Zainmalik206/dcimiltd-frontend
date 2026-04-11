import axios from 'axios'
import apis from "../../config/apis";

import { setLoading, setProducts,setProduct } from '../slices/prodSlice'


const fetchProducts = () =>async (dispatch) => {
    
    dispatch(setLoading())
        
     try{
        const {data} =await axios.get(apis.prod)
        const { products, ok , total} = data
        dispatch(setProducts(products))
        

    }catch(err){
          console.log(err.message)
    }
}

 const fetchProduct = (id) =>async (dispatch) => {
    
    dispatch(setLoading())
        
     try{
        const {data} =await axios.get(`${apis.prod}/${id}`)
        const { product, ok} = data
        dispatch(setProduct(product))
        

    }catch(err){
          console.log(err.message)
    }
}

export {
     fetchProducts,
     fetchProduct
}
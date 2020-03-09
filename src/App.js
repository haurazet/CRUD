import React,{useEffect, useState} from 'react';
import Axios from 'axios'
import './App.css';
import {Table,Spinner} from 'reactstrap'

function App() {
  const [users,setusers]=useState([])
  const [loading,setloading]=useState(true)
  const [edit,setedit]=useState(false)
  const [indexedit,setindexedit]=useState({
    edit:''
  })
  const [isChange,setischange]=useState(false)
  const [adddata,setadddata]=useState({
    username:'',
    deskripsi:''
  })
  const [editdata,seteditdata]=useState({})
  const Onadddatachange=(e)=>{
    setadddata({...adddata,[e.target.name]:e.target.value})
    
  }
  const Adddataclick=()=>{
    Axios.post('http://localhost:2000/users',{username:adddata.username,deskripsi:adddata.deskripsi})
    .then((res)=>{
      // console.log(res)
        Axios.get('http://localhost:2000/users')
      .then((res)=>{
        // console.log(res.data)
        setusers(res.data)
      }).catch((err)=>{
        // console.log(err)
      })
    }).catch((err)=>{
      // console.log(err)
    })
    
  }
  const Onbtndelete=(id)=>{
    Axios.delete(`http://localhost:2000/users/${id}`)
    .then((res)=>{
      Axios.get('http://localhost:2000/users')
      .then((res1)=>{
        // console.log(res1.data)
        setusers(res1.data)
      }).catch((err)=>{
        // console.log(err)
      })
    }).catch((err)=>{
      // console.log(err)
    })
  }
  const Onbtnedit=(id)=>{
   setedit(true)
   setindexedit({...indexedit,edit:id})
  }
  const Oneditcancel=()=>{
    setedit(false)
    setindexedit({...indexedit,edit:''})
  }
  const Oneditdatachange=(e)=>{
    seteditdata({...editdata,[e.target.name]:e.target.value})
    setischange(true)
  }
  const onupdateedit=(id)=>{
    if(isChange){
        Axios.patch(`http://localhost:2000/users/${id}`,{username:editdata.username,deskripsi:editdata.deskripsi})
        .then((res)=>{
          // console.log(res)
          Axios.get('http://localhost:2000/users')
          .then((res)=>{
            // console.log(res.data)
            setusers(res.data)
          }).catch((err)=>{
            // console.log(err)
          })
        }).catch((err)=>{
          // console.log(err)
        })
        setedit(false)
        seteditdata({})  
    }
    else{
      setedit(false)
    }
  }
  //kalo di hooks hrs pake const dpnnya
  //PENGGANTI DID MOUNT
  useEffect(()=>{
    Axios.get('http://localhost:2000/users')
    .then((res)=>{
      console.log(res.data)
      setusers(res.data)
    }).catch((err)=>{
      console.log(err)
    }).finally(()=>{
      setloading(false)
    })
  },[])

  //}) did update di reacthook
  //},[]) did mount di reacthook

  return (
    <div className="App">
      <h1> ini app</h1>
      {
        loading?
        <Spinner color="primary"/>
        :
        <Table striped>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama</th>
              <th>Deskripsi</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((val, index)=>{
                return(
                  edit?
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td> {val.id==indexedit.edit?<input type="text" placeholder='username'  defaultValue={val.username}  name='username' onChange={Oneditdatachange}/>
                          :
                          val.username}</td>
                    <td> {val.id==indexedit.edit?<input type="text" placeholder='deskripsi' defaultValue={val.deskripsi} name='deskripsi' onChange={Oneditdatachange}/>
                          :
                          val.deskripsi}</td>
                    <td>
                      <button type="button" className="btn btn-outline-success mr-3 " onClick={()=>onupdateedit(val.id)}>Update</button>
                      <button type="button" className="btn btn-outline-danger" onClick={Oneditcancel}>Cancel</button>
                    </td>
                  </tr>
                  :
                  <tr key={index}>
                    <td>{index+1}</td>
                    <td>{val.username}</td>
                    <td>{val.deskripsi}</td>
                    <td>
                      <button type="button" className="btn btn-outline-success mr-3" onClick={()=>Onbtnedit(val.id)}>Edit</button>
                      <button type="button" className="btn btn-outline-danger" onClick={()=>Onbtndelete(val.id)}>Delete</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
      }
      <div>
        <input type='text' className='mr-3' placeholder='username' value={adddata.username} name='username' onChange={Onadddatachange}/>
        <input type='text' placeholder='deskripsi' value={adddata.deskripsi} name='deskripsi' onChange={Onadddatachange}/>
        <button className='btn btn-primary ml-3' onClick={Adddataclick}> add data</button>
      </div>
    </div>
  );
}

//kalo ga dibikin callback maka dia langsung jalan pas di klik jadi delete semuanya (contoh di onbtndelete)
export default App;

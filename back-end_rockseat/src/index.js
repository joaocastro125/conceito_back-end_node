const express=require('express');
const {uuid,isUuid}=require('uuidv4');
/*
  middware é interceptador de requisições interrronpe totalmente a requisição ou altera dados da requisicão.
*/ 

const app=express();
app.use(express.json())

// rota get
const projects=[];
function logResquest(request,response,next){
  const {method , url}=request;
  const logLabel=`[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);
  return next();
}
// app.use(logResquest)
function validateProjectId(request,response,next){
  const {id}=request.params;
  if(!isUuid(id)){
    return response.status(400).json({erro:"Invalid project ID."})
  }
  return next()

}
app.get("/projects",(request,response)=>{
  const {name}=request.query;
  const results=name
  ?projects.filter(project=>project.name.includes(name))
  :projects;
  
  // params query
//  const {title,owner}=request.query;
 
 console.log(projects) ;
    return response.json(results);
});

app.post("/projects",(request,response)=>{
  const {name,year}=request.body;
  const project={id:uuid(),name,year}
  // o push adciona um array no final 
  projects.push(project); 
  return response.json(project);
});

app.put("/projects/:id", validateProjectId,(request,response)=>{
  // routes params e utilizando diretamente o id 
  const {id}=request.params;
  const {name,year}=request.body;
  // uma função do js que faz um procura informação do array 
  const projectIndex=projects.findIndex( project =>project.id==id);
  if(projectIndex<0){
    return response.status(400).json({erro:"project not found "})
  } 
  const project={
    id,
    name,
    year,
  };
  projects[projectIndex]=project;  
  return response.json(project);
});
app.delete("/projects/:id",validateProjectId ,(request,response)=>{
  const {id}=request.params;
  const projectIndex=projects.findIndex( project =>project.id==id);
  if(projectIndex<0){
    return response.status(400).json({erro:"project not found "})
  } 
  projects.slice(projectIndex,1);
  return response.status(204).send();
});

app.listen(3333,()=>console.log('🐱‍🏍back-end started!!'));
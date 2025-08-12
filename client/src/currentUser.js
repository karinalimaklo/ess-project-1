
  var userIndex = 0; 
  export function setAdmin(){
    userIndex = 1;
  }
  export function setCommonUser(){
    userIndex = 0;
  }
  const users = [
  {
    _id: '6897e7217b5d14b7d51cd17b',
    name: 'Paulo Miranda',
    email: 'paulo.miranda@example.com',
    isAdmin: false,
    status: 'Ativo',
    suspendedUntil: null,
    warnings: [],
    avatar: null,
  },
  {
    _id: '6897e7217b5d14b7d51cd179',
    name: 'Breno Borba',
    email: 'breno.borba@example.com',
    isAdmin: true,
    status: 'Ativo',
    suspendedUntil: null,
    warnings: [],
    avatar: null,
  },
  {
    _id: '6897e7217b5d14b7d51cd17a',
    name: 'Paulo Salgados',
    email: 'paulo.salgados@example.com',
    isAdmin: false,
    status: 'Ativo',
    suspendedUntil: null,
    warnings: [],
    avatar: null,
  },
  {
    _id: '6897e7217b5d14b7d51cd17c',
    name: 'Jaqueline Santos',
    email: 'jaqueline.santos@example.com',
    isAdmin: false,
    status: 'Ativo',
    suspendedUntil: null,
    warnings: [],
    avatar: null,
  },
  {
    _id: '6897e7217b5d14b7d51cd17d',
    name: 'Socorro Silva',
    email: 'socorro.silva@example.com',
    isAdmin: false,
    status: 'Ativo',
    suspendedUntil: null,
    warnings: [],
    avatar: null,
  },
  {
    _id: '6897e7217b5d14b7d51cd17e',
    name: 'Cleitinho Doce',
    email: 'cleitinho.doce@example.com',
    isAdmin: false,
    status: 'Suspenso',
    suspendedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    warnings: [],
    avatar: null,
  },
];
const currentUser = users[userIndex];
  
export default currentUser;
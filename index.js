require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
const ADMIN_ID = process.env.ADMIN_ID || 'C04ch4c3_bot#6174';
const client = new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent]});

const DB_PATH = './database/users.json';
const DATA_PATH = './data/questions.json';

if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, '{}');
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({free:[],premium:[],graduate:[]}));

client.once('ready', () => {
  console.log(`✅ C04ch4c3 COACH ACE LIVE! Admin: ${ADMIN_ID}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith('!')) return;
  
  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const userId = message.author.id;

  const users = JSON.parse(fs.readFileSync(DB_PATH));
  const questions = JSON.parse(fs.readFileSync(DATA_PATH));

  if (command === 'start') {
    users[userId] = users[userId] || {free:0,premium:0,graduate:0,trial_end:Date.now()+15*24*60*60*1000,tier:'free'};
    fs.writeFileSync(DB_PATH, JSON.stringify(users));
    message.reply('🎓 **C04ch4c3 COACH ACE** 🧠

Free trial: **201 MCQs** (15 days)
Premium: ₱99 Student / ₱119 Graduate

!quiz free');
  }

  if (command === 'quiz') {
    if (!users[userId]) return message.reply('!start first');
    const tier = args[0] || 'free';
    const user = users[userId];
    
    if (Date.now() > user.trial_end && user.tier === 'free') return message.reply('❌ Trial expired. !premium');
    if (user[tier] >= 201 && tier === 'free') return message.reply('❌ Free limit (201 MCQs). Upgrade!');
    
    if (questions[tier] && questions[tier].length > 0) {
      const q = questions[tier].pop();
      user[tier]++;
      fs.writeFileSync(DB_PATH, JSON.stringify(users));
      fs.writeFileSync(DATA_PATH, JSON.stringify(questions));
      message.reply(`**Q:** ${q.question}
**A)** ${q.a} **B)** ${q.b} **C)** ${q.c} **D)** ${q.d}

Reply **A/B/C/D**`);
    } else {
      message.reply('❌ No questions. Admin addq needed.');
    }
  }

  if (message.author.username === 'C04ch4c3' || message.author.id === ADMIN_ID) {
    if (command === 'addq') {
      const tier = args[0];
      const qData = {question:args[1],a:args[2],b:args[3],c:args[4],d:args[5],answer:args[6]};
      questions[tier].push(qData);
      fs.writeFileSync(DATA_PATH, JSON.stringify(questions));
      message.reply(`✅ Added ${tier}: ${args[1].substring(0,30)}...`);
    }
    if (command === 'reset') {
      const targetId = args[0];
      delete users[targetId];
      fs.writeFileSync(DB_PATH, JSON.stringify(users));
      message.reply(`✅ Reset ${targetId}`);
    }
  }
});

client.login(process.env.TOKEN);

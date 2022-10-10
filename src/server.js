import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

let journals = [
	{
		id: 1,
		date: '10-08-2022',
		active: true,
		memo: 'The Hat Shop',
		lineItems: [
			{
				id: 1,
				account: '1060 Community Spirit Account',
				debits: 400,
				credits: 0,
				description: '',
				name: '',
				sales_tax: 0,
			},
			{
				id: 2,
				account: '1080 Ways & Means Float',
				debits: 400,
				credits: 0,
				description: '',
				name: '',
				sales_tax: 0,
			},
			{
				id: 3,
				account: '2100 Accounts Payable',
				debits: 0,
				credits: 800,
				description: '',
				name: '',
				sales_tax: 0,
			},
		],
	},
	{
		id: 2,
		date: '10-09-2022',
		active: true,
		memo: "Dogs'r'us",
		lineItems: [
			{
				id: 1,
				account: '1200 Bones and Biskets',
				debits: 200,
				credits: 0,
				description: '',
				name: '',
				sales_tax: 0,
			},
			{
				id: 2,
				account: '1080 Couch Repairs',
				debits: 400,
				credits: 0,
				description: '',
				name: '',
				sales_tax: 0,
			},
			{
				id: 3,
				account: '2100 Show Winnings',
				debits: 0,
				credits: 600,
				description: '',
				name: '',
				sales_tax: 0,
			},
		],
	},
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

app.get(/^(?!\/api).+/, (req, res) => {
	res.sendFile(path.join(__dirname, '../build/index.html'));
});

//TODO: Log in user
export async function logInUser(user, password) {
	//Log in user
}

//TODO: Log out user
export async function logOutUser() {
	// Log out user
}

//TODO: Get entries for logged in user
app.get('/api/journals', async (req, res) => {
	res.send(journals);
});

// TODO: Add a new journal entry
app.put('/api/journal/new', async (req, res) => {
	const date = new Date();
	const entry = {
		id: journals.length + 1,
		date: date.toLocaleDateString('en-GB').split('/').join('-'),
		active: true,
		memo: '',
		lineItems: [],
	};
	journals.push(entry);
	res.send(journals);
});

// TODO: Delete journal entry
app.put('/api/journal/:id/delete', async (req, res) => {
	const { id } = req.params;
	const updateEntry = journals.find((a) => a.id == id);
	updateEntry['active'] = false;
	res.send(journals);
});

// TODO: Save entry
app.post('/api/journal/:id/save', async (req, res) => {
	const { id } = req.params;
	const { entry } = req.body;

	const updateEntry = journals.findIndex((a) => a.id == id);

	if (updateEntry !== undefined) {
		journals[updateEntry] = JSON.parse(entry);
	} else {
		journals.push(JSON.parse(entry));
	}

	res.send('success');
});

//TODO: Make sure user is logged in and has access to the requested entry
app.get('/api/journal/:id/', async (req, res) => {
	const { id } = req.params;
	const journal = journals.find((a) => a.id == id);
	res.send(journal);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
	console.log('Server is listening on port ' + PORT);
});

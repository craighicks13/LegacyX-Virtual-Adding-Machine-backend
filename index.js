import express from 'express';
import 'dotenv/config';
import { db, connectToDb } from './db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, './build')));

app.get(/^(?!\/api).+/, (req, res) => {
	res.sendFile(path.join(__dirname, './build/index.html'));
});
app.get('/api/journals/:uid', async (req, res) => {
	const { uid } = req.params;
	const journals = await db
		.collection('entries')
		.find({ active: true, uid: uid }, { id: 1, date: 1, memo: 1 })
		.toArray();
	if (journals) {
		res.json(journals);
	} else {
		res.sendStatus(404);
	}
});

app.post('/api/journal/:id/delete', async (req, res) => {
	const { id } = req.params;
	const { uid, entry_num } = req.body;

	const entry = await db
		.collection('entries')
		.updateOne({ entry_num }, { $set: { active: false } });

	if (entry.acknowledged) {
		const journals = await db
			.collection('entries')
			.find({ active: true, uid: uid })
			.toArray();
		res.json(journals);
	} else {
		res.sendStatus(404);
	}
});

app.post('/api/journal/:entry_num/save', async (req, res) => {
	const { entry_num } = req.params;
	const { entry, uid } = req.body;

	let saveEntry = JSON.parse(entry);
	let response, newEntry;

	if (entry_num === 'new') {
		newEntry = {
			memo: saveEntry.memo,
			date: saveEntry.date,
			lineItems: saveEntry.lineItems,
			active: true,
			uid: uid,
		};
		newEntry.entry_num = (
			(await db.collection('entries').count({})) + 1
		).toString();
		response = await db.collection('entries').insertOne(newEntry);
	} else {
		response = await db.collection('entries').updateOne(
			{ entry_num },
			{
				$set: {
					memo: saveEntry.memo,
					lineItems: saveEntry.lineItems,
				},
			}
		);
	}

	if (response.acknowledged) {
		if (entry_num === 'new') {
			res.send({ status: 'success', new_id: newEntry.entry_num });
		} else {
			res.send({ status: 'success' });
		}
	} else {
		res.sendStatus(500);
	}
});

app.get('/api/journal/:entry_num/', async (req, res) => {
	const { entry_num } = req.params;

	const entry = await db.collection('entries').findOne({ entry_num });

	if (entry) {
		res.json(entry);
	} else {
		res.sendStatus(404);
	}
});

const PORT = process.env.PORT || 8000;

connectToDb(() => {
	console.log('Connected to database');
	app.listen(PORT, () => {
		console.log('Server is listening on port ' + PORT);
	});
});

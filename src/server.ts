import 'dotenv/config';

interface Phone {
	id: number;
	type: number;
	value: string;
	tg_chat_id: number | null;
	max_chat_id: number | null;
	comment: string;
}

interface Lead {
	id: number;
	name: string;
	status: number;
}

interface LeadResponse {
	lead: Lead;
	phones: Phone[];
}

async function getLeadById(leadId: number): Promise<LeadResponse> {
	const baseUrl = process.env.DOMOPLANER_API_BASE;
	const token = process.env.DOMOPLANER_API_TOKEN;

	if (!baseUrl) {
		throw new Error('DOMOPLANER_API_BASE не задан');
	}

	if (!token) {
		throw new Error('DOMOPLANER_API_TOKEN не задан');
	}

	const url = `${baseUrl}/leads/get-by-id?id=${leadId}`;

	const response = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	if (!response.ok) {
		const errorBody = await response.text();

		throw new Error(
			`Domoplaner API error: ${response.status} ${response.statusText}\n${errorBody}`,
		);
	}

	const lead = (await response.json()) as LeadResponse;

	return lead;
}

function getLeadPhone(lead: LeadResponse): string | null {
	return lead.phones?.[0]?.value ?? null;
}

async function main() {
	const leadId = 4260303; // ID клиента
	const lead = await getLeadById(leadId);
	console.log('Телефон:', getLeadPhone(lead));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
export default class Log {
	private constructor() {}

	private static getDate() {
		const date = new Date();
	
		let day: string | number = date.getDate();
		let month: string | number = date.getMonth() + 1; // Months are zero based
		let year: string | number = date.getFullYear();
	
		if (day < 10) {
			day = "0" + day.toString();
		}
	
		if (month < 10) {
			month = "0" + month.toString();
		}
	
		let hour: string | number = date.getHours();
		let minute: string | number = date.getMinutes();
		let second: string | number = date.getSeconds();
	
		if (hour < 10) {
			hour = "0" + hour.toString();
		}
	
		if (minute < 10) {
			minute = "0" + minute.toString();
		}
	
		if (second < 10) {
			second = "0" + second.toString();
		}
	
		return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
	}

	private static getLogPrefix() {
		return "[" + this.getDate() + "]";
	}

	static error(message: any) {
		console.error(this.getLogPrefix(), "Error:", message);
	}

	static info(message: any) {
		console.log(this.getLogPrefix(), "Info:", message);
	}
}

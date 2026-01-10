import { logger, Structs } from "node-napcat-ts";
import { defineScript } from "../script_api.js";
import { getClientByToken } from "../data_base.js";

const linux = [
	{
		version: "3.2.12-28060",
		subid: 537246140,
		qua: "V1_LNX_NQ_3.2.12_28060_GW_B",
	},
	{
		version: "3.2.12-28131",
		subid: 537246140,
		qua: "V1_LNX_NQ_3.2.12_28131_GW_B",
	},
	{
		version: "3.2.12-28327",
		subid: 537249393,
		qua: "V1_LNX_NQ_3.2.12_28327_GW_B",
	},
	{
		version: "3.2.12-28418",
		subid: 537249393,
		qua: "V1_LNX_NQ_3.2.12_28418_GW_B",
	},
	{
		version: "3.2.13-28788",
		subid: 537249787,
		qua: "V1_LNX_NQ_3.2.13_28788_GW_B",
	},
	{
		version: "3.2.13-28971",
		subid: 537249848,
		qua: "V1_LNX_NQ_3.2.13_28971_GW_B",
	},
	{
		version: "3.2.13-29271",
		subid: 537249913,
		qua: "V1_LNX_NQ_3.2.13_29271_GW_B",
	},
	{
		version: "3.2.13-29456",
		subid: 537249996,
		qua: "V1_LNX_NQ_3.2.13_29456_GW_B",
	},
	{
		version: "3.2.13-29927",
		subid: 537255847,
		qua: "V1_LNX_NQ_3.2.13_29927_GW_B",
	},
	{
		version: "3.2.15-30366",
		subid: 537258413,
		qua: "V1_LNX_NQ_3.2.15_30366_GW_B",
	},
	{
		version: "3.2.15-30483",
		subid: 537258474,
		qua: "V1_LNX_NQ_3.2.15_30483_GW_B",
	},
	{
		version: "3.2.15-30594",
		subid: 537258474,
		qua: "V1_LNX_NQ_3.2.15_30594_GW_B",
	},
	{
		version: "3.2.15-30851",
		subid: 537263831,
		qua: "V1_LNX_NQ_3.2.15_30851_GW_B",
	},
	{
		version: "3.2.15-30899",
		subid: 537263831,
		qua: "V1_LNX_NQ_3.2.15_30899_GW_B",
	},
	{
		version: "3.2.15-31245",
		subid: 537266485,
		qua: "V1_LNX_NQ_3.2.15_31245_GW_B",
	},
	{
		version: "3.2.15-31363",
		subid: 537266535,
		qua: "V1_LNX_NQ_3.2.15_31363_GW_B",
	},
	{
		version: "3.2.16-32690",
		subid: 537271229,
		qua: "V1_LNX_NQ_3.2.16_32690_GW_B",
	},
	{
		version: "3.2.16-32721",
		subid: 537271229,
		qua: "V1_LNX_NQ_3.2.16_32721_GW_B",
	},
	{
		version: "3.2.16-32793",
		subid: 537271279,
		qua: "V1_LNX_NQ_3.2.16_32793_GW_B",
	},
	{
		version: "3.2.16-32869",
		subid: 537271329,
		qua: "V1_LNX_NQ_3.2.16_32869_GW_B",
	},
	{
		version: "3.2.16-33139",
		subid: 537273909,
		qua: "V1_LNX_NQ_3.2.16_33139_GW_B",
	},
	{
		version: "3.2.16-33800",
		subid: 537274009,
		qua: "V1_LNX_NQ_3.2.16_33800_GW_B",
	},
	{
		version: "3.2.17-34231",
		subid: 537279245,
		qua: "V1_LNX_NQ_3.2.17_34231_GW_B",
	},
	{
		version: "3.2.17-34362",
		subid: 537279296,
		qua: "V1_LNX_NQ_3.2.17_34362_GW_B",
	},
	{
		version: "3.2.17-34467",
		subid: 537282292,
		qua: "V1_LNX_NQ_3.2.17_34467_GW_B",
	},
	{
		version: "3.2.17-34566",
		subid: 537282343,
		qua: "V1_LNX_NQ_3.2.17_34566_GW_B",
	},
	{
		version: "3.2.17-34606",
		subid: 537282343,
		qua: "V1_LNX_NQ_3.2.17_34606_GW_B",
	},
	{
		version: "3.2.17-34740",
		subid: 537290727,
		qua: "V1_LNX_NQ_3.2.17_34740_GW_B",
	},
	{
		version: "3.2.17-35184",
		subid: 537291084,
		qua: "V1_LNX_NQ_3.2.17_35184_GW_B",
	},
	{
		version: "3.2.17-35341",
		subid: 537291383,
		qua: "V1_LNX_NQ_3.2.17_35341_GW_B",
	},
	{
		version: "3.2.18-35951",
		subid: 537296013,
		qua: "V1_LNX_NQ_3.2.18_35951_GW_B",
	},
	{
		version: "3.2.18-36580",
		subid: 537298509,
		qua: "V1_LNX_NQ_3.2.18_36580_GW_B",
	},
	{
		version: "3.2.18-37012",
		subid: 537304107,
		qua: "V1_LNX_NQ_3.2.18_37012_GW_B",
	},
	{
		version: "3.2.18-37051",
		subid: 537304158,
		qua: "V1_LNX_NQ_3.2.18_37051_GW_B",
	},
	{
		version: "3.2.18-37475",
		subid: 537304210,
		qua: "V1_LNX_NQ_3.2.18_37475_GW_B",
	},
	{
		version: "3.2.18-37625",
		subid: 537304261,
		qua: "V1_LNX_NQ_3.2.18_37625_GW_B",
	},
	{
		version: "3.2.19-38503",
		subid: 537307640,
		qua: "V1_LNX_NQ_3.2.19_38503_GW_B",
	},
	{
		version: "3.2.19-38626",
		subid: 537307691,
		qua: "V1_LNX_NQ_3.2.19_38626_GW_B",
	},
	{
		version: "3.2.19-38960",
		subid: 537313891,
		qua: "V1_LNX_NQ_3.2.19_38960_GW_B",
	},
	{
		version: "3.2.19-39038",
		subid: 537313942,
		qua: "V1_LNX_NQ_3.2.19_39038_GW_B",
	},
	{
		version: "3.2.20-40768",
		subid: 537319840,
		qua: "V1_LNX_NQ_3.2.20_40768_GW_B",
	},
	{
		version: "3.2.20-40824",
		subid: 537319840,
		qua: "V1_LNX_NQ_3.2.20_40824_GW_B",
	},
	{
		version: "3.2.20-40990",
		subid: 537319891,
		qua: "V1_LNX_NQ_3.2.20_40990_GW_B",
	},
	{
		version: "3.2.21-41857",
		subid: 537320197,
		qua: "V1_LNX_NQ_3.2.21_41857_GW_B",
	},
	{
		version: "3.2.21-42086",
		subid: 537320248,
		qua: "V1_LNX_NQ_3.2.21_42086_GW_B",
	},
	{
		version: "3.2.22-42941",
		subid: 537328659,
		qua: "V1_LNX_NQ_3.2.22_42941_GW_B",
	},
];

const macos = [
	{
		version: "6.9.55-28131",
		subid: 537246115,
		qua: "V1_MAC_NQ_6.9.55_28131_GW_B",
	},
	{
		version: "6.9.56-28418",
		subid: 537249367,
		qua: "V1_MAC_NQ_6.9.56_28418_GW_B",
	},
	{
		version: "6.9.58-28971",
		subid: 537249826,
		qua: "V1_MAC_NQ_6.9.58_28971_GW_B",
	},
	{
		version: "6.9.59-29271",
		subid: 537249863,
		qua: "V1_MAC_NQ_6.9.59_29271_GW_B",
	},
	{
		version: "6.9.59-29456",
		subid: 537249961,
		qua: "V1_MAC_NQ_6.9.59_29456_GW_B",
	},
	{
		version: "6.9.61-29927",
		subid: 537255836,
		qua: "V1_MAC_NQ_6.9.61_29927_GW_B",
	},
	{
		version: "6.9.62-30366",
		subid: 537258401,
		qua: "V1_MAC_NQ_6.9.62_30366_GW_B",
	},
	{
		version: "6.9.62-30483",
		subid: 537258463,
		qua: "V1_MAC_NQ_6.9.62_30483_GW_B",
	},
	{
		version: "6.9.62-30594",
		subid: 537258463,
		qua: "V1_MAC_NQ_6.9.62_30594_GW_B",
	},
	{
		version: "6.9.63-30851",
		subid: 537263820,
		qua: "V1_MAC_NQ_6.9.63_30851_GW_B",
	},
	{
		version: "6.9.63-30899",
		subid: 537263820,
		qua: "V1_MAC_NQ_6.9.63_30899_GW_B",
	},
	{
		version: "6.9.63-31245",
		subid: 537266474,
		qua: "V1_MAC_NQ_6.9.63_31245_GW_B",
	},
	{
		version: "6.9.65-31363",
		subid: 537266524,
		qua: "V1_MAC_NQ_6.9.65_31363_GW_B",
	},
	{
		version: "6.9.66-32690",
		subid: 537271218,
		qua: "V1_MAC_NQ_6.9.66_32690_GW_B",
	},
	{
		version: "6.9.82-40768",
		subid: 537319829,
		qua: "V1_MAC_NQ_6.9.82_40768_GW_B",
	},
	{
		version: "6.9.82-40824",
		subid: 537319829,
		qua: "V1_MAC_NQ_6.9.82_40824_GW_B",
	},
	{
		version: "6.9.82-40990",
		subid: 537319880,
		qua: "V1_MAC_NQ_6.9.82_40990_GW_B",
	},
	{
		version: "6.9.83-41679",
		subid: 537320135,
		qua: "V1_MAC_NQ_6.9.83_41679_GW_B",
	},
	{
		version: "6.9.83-41785",
		subid: 537320135,
		qua: "V1_MAC_NQ_6.9.83_41785_GW_B",
	},
	{
		version: "6.9.83-41857",
		subid: 537320186,
		qua: "V1_MAC_NQ_6.9.83_41857_GW_B",
	},
	{
		version: "6.9.85-42086",
		subid: 537320237,
		qua: "V1_MAC_NQ_6.9.85_42086_GW_B",
	},
	{
		version: "6.9.86-42744",
		subid: 537328495,
		qua: "V1_MAC_NQ_6.9.85_42744_GW_B",
	},
	{
		version: "6.9.86-42905",
		subid: 537328546,
		qua: "V1_MAC_NQ_6.9.86_42905_GW_B",
	},
	{
		version: "6.9.86-42941",
		subid: 537328648,
		qua: "V1_MAC_NQ_6.9.86_42941_GW_B",
	},
];

const windows = [
	{
		version: "9.9.15-28060",
		subid: 537246092,
		qua: "V1_WIN_NQ_9.9.15_28060_GW_B",
	},
	{
		version: "9.9.15-28131",
		subid: 537246092,
		qua: "V1_WIN_NQ_9.9.15_28131_GW_B",
	},
	{
		version: "9.9.15-28327",
		subid: 537249321,
		qua: "V1_WIN_NQ_9.9.15_28327_GW_B",
	},
	{
		version: "9.9.15-28418",
		subid: 537249321,
		qua: "V1_WIN_NQ_9.9.15_28418_GW_B",
	},
	{
		version: "9.9.15-28498",
		subid: 537249321,
		qua: "V1_WIN_NQ_9.9.15_28498_GW_B",
	},
	{
		version: "9.9.16-28788",
		subid: 537249739,
		qua: "V1_WIN_NQ_9.9.16_28788_GW_B",
	},
	{
		version: "9.9.16-28971",
		subid: 537249775,
		qua: "V1_WIN_NQ_9.9.16_28971_GW_B",
	},
	{
		version: "9.9.16-29271",
		subid: 537249813,
		qua: "V1_WIN_NQ_9.9.16_29271_GW_B",
	},
	{
		version: "9.9.16-29456",
		subid: 537249875,
		qua: "V1_WIN_NQ_9.9.16_29456_GW_B",
	},
	{
		version: "9.9.16-29927",
		subid: 537255812,
		qua: "V1_WIN_NQ_9.9.16_29927_GW_B",
	},
	{
		version: "9.9.17-30366",
		subid: 537258389,
		qua: "V1_WIN_NQ_9.9.17_30366_GW_B",
	},
	{
		version: "9.9.17-30483",
		subid: 537258439,
		qua: "V1_WIN_NQ_9.9.17_30483_GW_B",
	},
	{
		version: "9.9.17-30594",
		subid: 537258439,
		qua: "V1_WIN_NQ_9.9.17_30594_GW_B",
	},
	{
		version: "9.9.17-30851",
		subid: 537263796,
		qua: "V1_WIN_NQ_9.9.17_30851_GW_B",
	},
	{
		version: "9.9.17-30899",
		subid: 537263796,
		qua: "V1_WIN_NQ_9.9.17_30899_GW_B",
	},
	{
		version: "9.9.17-31219",
		subid: 537266450,
		qua: "V1_WIN_NQ_9.9.17_31219_GW_B",
	},
	{
		version: "9.9.17-31245",
		subid: 537266450,
		qua: "V1_WIN_NQ_9.9.17_31245_GW_B",
	},
	{
		version: "9.9.17-31363",
		subid: 537266500,
		qua: "V1_WIN_NQ_9.9.17_31363_GW_B",
	},
	{
		version: "9.9.18-32690",
		subid: 537271194,
		qua: "V1_WIN_NQ_9.9.18_32690_GW_B",
	},
	{
		version: "9.9.18-32793",
		subid: 537271244,
		qua: "V1_WIN_NQ_9.9.18_32793_GW_B",
	},
	{
		version: "9.9.18-32869",
		subid: 537271294,
		qua: "V1_WIN_NQ_9.9.18_32869_GW_B",
	},
	{
		version: "9.9.18-33139",
		subid: 537273874,
		qua: "V1_WIN_NQ_9.9.18_33139_GW_B",
	},
	{
		version: "9.9.18-33800",
		subid: 537273974,
		qua: "V1_WIN_NQ_9.9.18_33800_GW_B",
	},
	{
		version: "9.9.19-34231",
		subid: 537279209,
		qua: "V1_WIN_NQ_9.9.19_34231_GW_B",
	},
	{
		version: "9.9.19-34362",
		subid: 537279260,
		qua: "V1_WIN_NQ_9.9.19_34362_GW_B",
	},
	{
		version: "9.9.19-34467",
		subid: 537282256,
		qua: "V1_WIN_NQ_9.9.19_34467_GW_B",
	},
	{
		version: "9.9.19-34566",
		subid: 537282307,
		qua: "V1_WIN_NQ_9.9.19_34566_GW_B",
	},
	{
		version: "9.9.19-34606",
		subid: 537282307,
		qua: "V1_WIN_NQ_9.9.19_34606_GW_B",
	},
	{
		version: "9.9.19-34740",
		subid: 537290691,
		qua: "V1_WIN_NQ_9.9.19_34740_GW_B",
	},
	{
		version: "9.9.19-34958",
		subid: 537290742,
		qua: "V1_WIN_NQ_9.9.19_34958_GW_B",
	},
	{
		version: "9.9.19-35184",
		subid: 537291048,
		qua: "V1_WIN_NQ_9.9.19_35184_GW_B",
	},
	{
		version: "9.9.19-35341",
		subid: 537291347,
		qua: "V1_WIN_NQ_9.9.19_35341_GW_B",
	},
	{
		version: "9.9.19-35469",
		subid: 537291398,
		qua: "V1_WIN_NQ_9.9.19_35469_GW_B",
	},
	{
		version: "9.9.20-35951",
		subid: 537295977,
		qua: "V1_WIN_NQ_9.9.20_35951_GW_B",
	},
	{
		version: "9.9.20-36580",
		subid: 537298473,
		qua: "V1_WIN_NQ_9.9.20_36580_GW_B",
	},
	{
		version: "9.9.20-37012",
		subid: 537304071,
		qua: "V1_WIN_NQ_9.9.20_37012_GW_B",
	},
	{
		version: "9.9.20-37051",
		subid: 537304122,
		qua: "V1_WIN_NQ_9.9.20_37051_GW_B",
	},
	{
		version: "9.9.20-37475",
		subid: 537304173,
		qua: "V1_WIN_NQ_9.9.20_37475_GW_B",
	},
	{
		version: "9.9.20-37625",
		subid: 537304224,
		qua: "V1_WIN_NQ_9.9.20_37625_GW_B",
	},
	{
		version: "9.9.21-38503",
		subid: 537307604,
		qua: "V1_WIN_NQ_9.9.21_38503_GW_B",
	},
	{
		version: "9.9.21-38711",
		subid: 537307655,
		qua: "V1_WIN_NQ_9.9.21_38626_GW_B",
	},
	{
		version: "9.9.21-38960",
		subid: 537313855,
		qua: "V1_WIN_NQ_9.9.21_38960_GW_B",
	},
	{
		version: "9.9.21-39038",
		subid: 537313906,
		qua: "V1_WIN_NQ_9.9.21_39038_GW_B",
	},
	{
		version: "9.9.22-40362",
		subid: 537314212,
		qua: "V1_WIN_NQ_9.9.22_40362_GW_B",
	},
	{
		version: "9.9.22-40768",
		subid: 537319804,
		qua: "V1_WIN_NQ_9.9.22_40768_GW_B",
	},
	{
		version: "9.9.22-40824",
		subid: 537319804,
		qua: "V1_WIN_NQ_9.9.22_40824_GW_B",
	},
	{
		version: "9.9.22-40990",
		subid: 537319855,
		qua: "V1_WIN_NQ_9.9.22.40990_GW_B",
	},
	{
		version: "9.9.23-41679",
		subid: 537320110,
		qua: "V1_WIN_NQ_9.9.23_41679_GW_B",
	},
	{
		version: "9.9.23-41785",
		subid: 537320110,
		qua: "V1_WIN_NQ_9.9.23_41785_GW_B",
	},
	{
		version: "9.9.23-41857",
		subid: 537320161,
		qua: "V1_WIN_NQ_9.9.23_41857_GW_B",
	},
	{
		version: "9.9.23-42086",
		subid: 537320212,
		qua: "V1_WIN_NQ_9.9.23_42086_GW_B",
	},
	{
		version: "9.9.23-42430",
		subid: 537320212,
		qua: "V1_WIN_NQ_9.9.23_42430_GW_B",
	},
	{
		version: "9.9.25-42744",
		subid: 537328470,
		qua: "V1_WIN_NQ_9.9.23_42744_GW_B",
	},
	{
		version: "9.9.25-42905",
		subid: 537328521,
		qua: "V1_WIN_NQ_9.9.25_42905_GW_B",
	},
	{
		version: "9.9.25-42941",
		subid: 537328623,
		qua: "V1_WIN_NQ_9.9.25_42941_GW_B",
	},
];

const mobile = [
	// 每个版本不同的信息
	{
		version: "9.2.60",
		ver: "9.2.60",
		subid: 537334969,
		apad_subid: 537334969,
	},
	{
		name: "A9.2.50.ceb9b856",
		version: "9.2.55",
		ver: "9.2.55",
		subid: 537333095,
		apad_subid: 537333095,
		qua: "V1_AND_SQ_9.2.50_12670_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2591",
		buildtime: 1762849776,
		ssover: 22,
		fekit_ver: "8.503.945",
	},
	{
		name: "A9.2.50.ceb9b856",
		version: "9.2.50.32575",
		ver: "9.2.50",
		subid: 537330095,
		apad_subid: 537330134,
		qua: "V1_AND_SQ_9.2.50_12670_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2591",
		buildtime: 1762849776,
		ssover: 22,
		fekit_ver: "8.503.945",
	},
	{
		name: "A9.2.35.c6ee04be",
		version: "9.2.35.32150",
		ver: "9.2.35",
		subid: 537327451,
		apad_subid: 537327490,
		qua: "V1_AND_SQ_9.2.35_12500_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2591",
		buildtime: 1762849776,
		ssover: 22,
		fekit_ver: "8.502.936",
	},
	{
		name: "A9.2.30.1a3e90af",
		version: "9.2.30.31725",
		ver: "9.2.30",
		subid: 537324431,
		apad_subid: 537324470,
		qua: "V1_AND_SQ_9.2.30_12330_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2589",
		buildtime: 1757058014,
		ssover: 22,
		fekit_ver: "8.501.933",
	},
	{
		name: "A9.2.27.636ed9e0",
		version: "9.2.27.31300",
		ver: "9.2.27",
		subid: 537323303,
		apad_subid: 537323342,
		qua: "V1_AND_SQ_9.2.27_12160_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2589",
		buildtime: 1757058014,
		ssover: 22,
		fekit_ver: "8.500.910",
	},
	{
		name: "A9.2.25.593ac7a8",
		version: "9.2.25.30450",
		ver: "9.2.25",
		subid: 537318125,
		apad_subid: 537318164,
		qua: "V1_AND_SQ_9.2.25_11820_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2589",
		buildtime: 1757058014,
		ssover: 22,
		fekit_ver: "8.500.910",
	},
	{
		name: "A9.2.20.777b5929",
		version: "9.2.20.30025",
		ver: "9.2.20",
		subid: 537315786,
		apad_subid: 537315825,
		qua: "V1_AND_SQ_9.2.20_11650_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2589",
		buildtime: 1757058014,
		ssover: 22,
		fekit_ver: "8.409.903",
	},
	{
		name: "A9.2.15.012a1717",
		version: "9.2.15.29600",
		ver: "9.2.15",
		subid: 537312176,
		apad_subid: 537312215,
		qua: "V1_AND_SQ_9.2.15_11480_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2588",
		buildtime: 1755676630,
		ssover: 22,
		fekit_ver: "8.408.897",
	},
	{
		name: "A9.2.10.fad8a0d9",
		version: "9.2.10.29175",
		ver: "9.2.10",
		subid: 537309838,
		apad_subid: 537309877,
		qua: "V1_AND_SQ_9.2.10_11310_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2587",
		buildtime: 1754919788,
		ssover: 22,
		fekit_ver: "8.407.888",
	},
	{
		name: "A9.2.5.2c3ad708",
		version: "9.2.5.28755",
		ver: "9.2.5",
		subid: 537306612,
		apad_subid: 537306651,
		qua: "V1_AND_SQ_9.2.5_11142_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2585",
		buildtime: 1752744019,
		ssover: 22,
		fekit_ver: "8.406.883",
	},
	{
		name: "A9.2.5.6039dd6b",
		version: "9.2.5.28750",
		ver: "9.2.5",
		subid: 537306534,
		apad_subid: 537306573,
		qua: "V1_AND_SQ_9.2.5_11140_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2585",
		buildtime: 1752744019,
		ssover: 22,
		fekit_ver: "8.406.883",
	},
	{
		name: "A9.2.0.0a244d9a",
		version: "9.2.0.28325",
		ver: "9.2.0",
		subid: 537303052,
		apad_subid: 537303091,
		qua: "V1_AND_SQ_9.2.0_10970_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2584",
		buildtime: 1751448568,
		ssover: 22,
		fekit_ver: "8.405.873",
	},
	{
		name: "A9.1.97.b351e214",
		version: "9.1.97.27900",
		ver: "9.1.97",
		subid: 537301750,
		apad_subid: 537301789,
		qua: "V1_AND_SQ_9.1.97_10800_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2582",
		buildtime: 1748422598,
		ssover: 22,
		fekit_ver: "8.404.864",
	},
	{
		name: "A9.1.95.1eed49c0",
		version: "9.1.95.27050",
		ver: "9.1.95",
		subid: 537297272,
		apad_subid: 537297311,
		qua: "V1_AND_SQ_9.1.95_10460_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2582",
		buildtime: 1748422598,
		ssover: 22,
		fekit_ver: "8.404.864",
	},
	{
		name: "A9.1.92.cb84b334",
		version: "9.1.92.26650",
		ver: "9.1.92",
		subid: 537294996,
		apad_subid: 537295035,
		qua: "V1_AND_SQ_9.1.92_10300_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2581",
		buildtime: 1747820974,
		ssover: 22,
		fekit_ver: "8.403.855",
	},
	{
		name: "A9.1.91.304e0cba",
		version: "9.1.91.26645",
		ver: "9.1.91",
		subid: 537294918,
		apad_subid: 537294957,
		qua: "V1_AND_SQ_9.1.91_10298_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2581",
		buildtime: 1747820974,
		ssover: 22,
		fekit_ver: "8.403.855",
	},
	{
		name: "A9.1.90.58326526",
		version: "9.1.90.26625",
		ver: "9.1.90",
		subid: 537294606,
		apad_subid: 537294645,
		qua: "V1_AND_SQ_9.1.90_10290_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2581",
		buildtime: 1747820974,
		ssover: 22,
		fekit_ver: "8.403.855",
	},
	{
		name: "A9.1.76.a36f04fb",
		version: "9.1.76.26090",
		ver: "9.1.76",
		subid: 537288619,
		apad_subid: 537288658,
		qua: "V1_AND_SQ_9.1.76_10076_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2578",
		buildtime: 1746016194,
		ssover: 22,
		fekit_ver: "8.402.848",
	},
	{
		name: "A9.1.75.ec478a78",
		version: "9.1.75.26070",
		ver: "9.1.75",
		subid: 537288307,
		apad_subid: 537288346,
		qua: "V1_AND_SQ_9.1.75_10068_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2578",
		buildtime: 1746016194,
		ssover: 22,
		fekit_ver: "8.402.840",
	},
	{
		name: "A9.1.71.7bacc589",
		version: "9.1.71.25665",
		ver: "9.1.71",
		subid: 537286259,
		apad_subid: 537286298,
		qua: "V1_AND_SQ_9.1.71_9906_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2574",
		buildtime: 1745224715,
		ssover: 22,
		fekit_ver: "8.401.830",
	},
	{
		name: "A9.1.70.88c475c0",
		version: "9.1.70.25645",
		ver: "9.1.70",
		subid: 537285947,
		apad_subid: 537285986,
		qua: "V1_AND_SQ_9.1.70_9898_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2574",
		buildtime: 1745224715,
		ssover: 22,
		fekit_ver: "8.401.830",
	},
].map((shortInfo) => {
	// 固定信息
	return {
		id: "com.tencent.mobileqq",
		nt: true,
		nt_login: true,
		appid: 16,
		app_key: "0S200MNJT807V3GE",
		sign: Buffer.from("A6B745BF24A2C277527716F6F36EB68D", "hex"),
		main_sig_map: 16724722,
		sub_sig_map: 66560,
		display: "Android",
		device_type: -1,
		bitmap: 0x08f7ff7c,
		client_ver: 8001,
		...shortInfo,
	};
});
const mobile_old = [
	{
		name: "A9.1.67.06b27928",
		version: "9.1.67.25220",
		ver: "9.1.67",
		subid: 537284101,
		apad_subid: 537284140,
		qua: "V1_AND_SQ_9.1.67_9728_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2570",
		buildtime: 1742975242,
		ssover: 22,
		fekit_ver: "8.400.814",
	},
	{
		name: "A9.1.65.5017700a",
		version: "9.1.65.24795",
		ver: "9.1.65",
		subid: 537278302,
		apad_subid: 537278341,
		qua: "V1_AND_SQ_9.1.65_9558_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2570",
		buildtime: 0x67e3b10a,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.400.814",
	},
	{
		name: "A9.1.60.045f5d19",
		version: "9.1.60.24370",
		ver: "9.1.60",
		subid: 537275636,
		apad_subid: 537275675,
		qua: "V1_AND_SQ_9.1.60_9388_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2568",
		buildtime: 0x67bdac68,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.400.807",
	},
	{
		name: "A9.1.55.464b50b2",
		version: "9.1.55.23945",
		ver: "9.1.55",
		subid: 537272835,
		apad_subid: 537272874,
		qua: "V1_AND_SQ_9.1.55_9218_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2568",
		buildtime: 0x67bdac68,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.309.798",
	},
	{
		name: "A9.1.52.b97ab15e",
		version: "9.1.52.23535",
		ver: "9.1.52",
		subid: 537270265,
		apad_subid: 537270304,
		qua: "V1_AND_SQ_9.1.52_9054_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2566",
		buildtime: 0x678f7fb7,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.308.786",
	},
	{
		name: "A9.1.50.83cc325e",
		version: "9.1.50.23520",
		ver: "9.1.50",
		subid: 537270031,
		apad_subid: 537270070,
		qua: "V1_AND_SQ_9.1.50_9048_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2566",
		buildtime: 0x678f7fb7,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.308.786",
	},
	{
		name: "A9.1.35.9f1a1697",
		version: "9.1.35.22670",
		ver: "9.1.35",
		subid: 537265576,
		apad_subid: 537265615,
		qua: "V1_AND_SQ_9.1.35_8708_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.307.779",
	},
	{
		name: "A9.1.31.cb8cd007",
		version: "9.1.31.22255",
		ver: "9.1.31",
		subid: 537262715,
		apad_subid: 537262754,
		qua: "V1_AND_SQ_9.1.31_8542_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.306.776",
	},
	{
		name: "A9.1.30.a920c625",
		version: "9.1.30.22245",
		ver: "9.1.30",
		subid: 537262559,
		apad_subid: 537262598,
		qua: "V1_AND_SQ_9.1.30_8538_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.306.776",
	},
	{
		name: "A9.1.25.008c1bb3",
		version: "9.1.25.21820",
		ver: "9.1.25",
		subid: 537260030,
		apad_subid: 537260069,
		qua: "V1_AND_SQ_9.1.25_8368_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.305.770",
	},
	{
		name: "A9.1.20.fa404fa6",
		version: "9.1.20.21395",
		ver: "9.1.20",
		subid: 537257414,
		apad_subid: 537257453,
		qua: "V1_AND_SQ_9.1.20_8198_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.304.766",
	},
	{
		name: "A9.1.16.3fe73575",
		version: "9.1.16.20980",
		ver: "9.1.16",
		subid: 537254305,
		apad_subid: 537254344,
		qua: "V1_AND_SQ_9.1.16_8032_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.303.759",
	},
	{
		name: "A9.1.15.25851cef",
		version: "9.1.15.20970",
		ver: "9.1.15",
		subid: 537254149,
		apad_subid: 537254188,
		qua: "V1_AND_SQ_9.1.15_8028_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.303.755",
	},
	{
		name: "A9.1.10.2ce90365",
		version: "9.1.10.20545",
		ver: "9.1.10",
		subid: 537251380,
		apad_subid: 537251419,
		qua: "V1_AND_SQ_9.1.10_7858_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.302.739",
	},
	{
		name: "A9.1.5.468dd2ea",
		version: "9.1.5.20120",
		ver: "9.1.5",
		subid: 537247779,
		apad_subid: 537247818,
		qua: "V1_AND_SQ_9.1.5_7688_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2565",
		buildtime: 0x6705241d,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.301.724",
	},
	{
		name: "A9.1.0.2129b4e8",
		version: "9.1.0.19695",
		ver: "9.1.0",
		subid: 537244893,
		apad_subid: 537244932,
		qua: "V1_AND_SQ_9.1.0_7518_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2564",
		buildtime: 0x66cd4b59,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.209.692",
	},
	{
		name: "A9.0.95.705d26da",
		version: "9.0.95.19320",
		ver: "9.0.95",
		subid: 537242075,
		apad_subid: 537242114,
		qua: "V1_AND_SQ_9.0.95_7368_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 0x66c6f015,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.208.645",
	},
	{
		name: "A9.0.90.38ae7504",
		version: "9.0.90.18945",
		ver: "9.0.90",
		subid: 537239255,
		apad_subid: 537239294,
		qua: "V1_AND_SQ_9.0.90_7218_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.207.627",
	},
	{
		name: "A9.0.85.491c232e",
		version: "9.0.85.18570",
		ver: "9.0.85",
		subid: 537236316,
		apad_subid: 537236355,
		qua: "V1_AND_SQ_9.0.85_7068_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.206.607",
	},
	{
		name: "A9.0.81.3daf0e38",
		version: "9.0.81.18205",
		ver: "9.0.81",
		subid: 537233527,
		apad_subid: 537233566,
		qua: "V1_AND_SQ_9.0.81_6922_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.205.580",
	},
	{
		name: "A9.0.80.0d6f99ed",
		version: "9.0.80.18195",
		ver: "9.0.80",
		subid: 537233371,
		apad_subid: 537233410,
		qua: "V1_AND_SQ_9.0.80_6918_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.205.580",
	},
	{
		name: "A9.0.75.c0dc0382",
		version: "9.0.75.17920",
		ver: "9.0.75",
		subid: 537230737,
		apad_subid: 537230776,
		qua: "V1_AND_SQ_9.0.75_6808_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.204.574",
	},
	{
		name: "A9.0.71.e2f45246",
		version: "9.0.71.17655",
		ver: "9.0.71",
		subid: 537228643,
		apad_subid: 537228682,
		qua: "V1_AND_SQ_9.0.71_6702_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.203.564",
	},
	{
		name: "A9.0.70.e4b76fcc",
		version: "9.0.70.17645",
		ver: "9.0.70",
		subid: 537228487,
		apad_subid: 537228526,
		qua: "V1_AND_SQ_9.0.70_6698_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2561",
		buildtime: 0x666bfec0,
		bitmap: 0x08f7ff7c,
		ssover: 0x15,
		fekit_ver: "8.203.564",
	},
	{
		name: "A9.0.65.530ce28d",
		version: "9.0.65.17370",
		ver: "9.0.65",
		subid: 537225139,
		apad_subid: 537225178,
		qua: "V1_AND_SQ_9.0.65_6588_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2560",
		buildtime: 0x6620c7e5,
		bitmap: 150470524,
		ssover: 21,
		fekit_ver: "8.202.560",
	},
	{
		name: "A9.0.60.c5f71993",
		version: "9.0.60.17095",
		ver: "9.0.60",
		subid: 537222797,
		apad_subid: 537222836,
		qua: "V1_AND_SQ_9.0.60_6478_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2560",
		buildtime: 0x6620c7e5,
		bitmap: 150470524,
		ssover: 21,
		fekit_ver: "8.201.556",
	},
	{
		name: "A9.0.56.c25547f8",
		version: "9.0.56.16830",
		ver: "9.0.56",
		subid: 537220323,
		apad_subid: 537220362,
		qua: "V1_AND_SQ_9.0.56_6372_YYB_D",
		sdkver: "6.0.0.2560",
		buildtime: 0x6620c7e5,
		bitmap: 150470524,
		ssover: 21,
		fekit_ver: "8.200.555",
	},
	{
		name: "A9.0.55.54f52314",
		version: "9.0.55.16820",
		ver: "9.0.55",
		buildtime: 1713424357,
		subid: 537220167,
		apad_subid: 537220206,
		bitmap: 150470524,
		sdkver: "6.0.0.2560",
		qua: "V1_AND_SQ_9.0.55_6368_YYB_D",
		ssover: 21,
		fekit_ver: "8.200.555",
	},
	{
		name: "A9.0.50.a9d8c8dc",
		version: "9.0.50.16545",
		ver: "9.0.50",
		buildtime: 1710769234,
		subid: 537217916,
		apad_subid: 537217955,
		bitmap: 150470524,
		sdkver: "6.0.0.2559",
		qua: "V1_AND_SQ_9.0.50_6258_YYB_D",
		ssover: 21,
		fekit_ver: "8.106.542",
	},
	{
		name: "A9.0.35.52ab3f26",
		version: "9.0.35.16275",
		ver: "9.0.35",
		buildtime: 1710769234,
		subid: 537215475,
		apad_subid: 537215514,
		bitmap: 150470524,
		sdkver: "6.0.0.2559",
		qua: "V1_AND_SQ_9.0.35_6150_YYB_D",
		ssover: 21,
		fekit_ver: "8.105.541",
	},
	{
		name: "A9.0.35.50c16765",
		version: "9.0.35.16270",
		ver: "9.0.35",
		buildtime: 1710769234,
		subid: 537215397,
		apad_subid: 537215436,
		bitmap: 150470524,
		sdkver: "6.0.0.2559",
		qua: "V1_AND_SQ_9.0.35_6148_YYB_D",
		ssover: 21,
		fekit_ver: "8.105.541",
	},
	{
		name: "A9.0.30.47d3bd6c",
		version: "9.0.30.15995",
		ver: "9.0.30",
		buildtime: 1710769234,
		subid: 537211926,
		apad_subid: 537211965,
		bitmap: 150470524,
		sdkver: "6.0.0.2559",
		qua: "V1_AND_SQ_9.0.30_6038_YYB_D",
		ssover: 21,
		fekit_ver: "8.104.509",
	},
	{
		name: "A9.0.25.63b29b33",
		version: "9.0.25.15760",
		ver: "9.0.25",
		buildtime: 1702888273,
		subid: 537210084,
		apad_subid: 537210123,
		bitmap: 150470524,
		sdkver: "6.0.0.2558",
		qua: "V1_AND_SQ_9.0.25_5942_YYB_D",
		ssover: 21,
		fekit_ver: "8.103.508",
	},
	{
		name: "A9.0.25.e1f154c9",
		version: "9.0.25.15735",
		ver: "9.0.25",
		buildtime: 1702888273,
		subid: 537210006,
		apad_subid: 537210045,
		bitmap: 150470524,
		sdkver: "6.0.0.2558",
		qua: "V1_AND_SQ_9.0.25_5932_YYB_D",
		ssover: 21,
		fekit_ver: "8.103.508",
	},
	{
		name: "A9.0.20.38faf5bf",
		version: "9.0.20.15515",
		ver: "9.0.20",
		buildtime: 1702888273,
		subid: 537206436,
		apad_subid: 537206475,
		bitmap: 150470524,
		sdkver: "6.0.0.2558",
		qua: "V1_AND_SQ_9.0.20_5844_YYB_D",
		ssover: 21,
		fekit_ver: "8.102.502",
	},
	{
		name: "A9.0.17.215f2081",
		version: "9.0.17.15190",
		ver: "9.0.17",
		subid: 537204134,
		apad_subid: 537204173,
		qua: "V1_AND_SQ_9.0.17_5714_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2558",
		buildtime: 1702888273,
		ssover: 21,
		fekit_ver: "8.101.471",
	},
	{
		name: "A9.0.17.6a4a36ca",
		version: "9.0.17.15185",
		ver: "9.0.17",
		buildtime: 1702888273,
		subid: 537204056,
		apad_subid: 537204095,
		bitmap: 150470524,
		sdkver: "6.0.0.2558",
		qua: "V1_AND_SQ_9.0.17_5712_YYB_D",
		ssover: 21,
		fekit_ver: "8.101.471",
	},
	{
		name: "A9.0.15.4145f774",
		version: "9.0.15.14970",
		ver: "9.0.15",
		subid: 537202216,
		apad_subid: 537202255,
		qua: "V1_AND_SQ_9.0.15_5626_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2558",
		buildtime: 1702888273,
		ssover: 21,
		fekit_ver: "8.101.471",
	},
	{
		name: "A9.0.8.10368491",
		version: "9.0.8.14755",
		ver: "9.0.8",
		subid: 537200218,
		apad_subid: 537200257,
		qua: "V1_AND_SQ_9.0.8_5540_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2558",
		buildtime: 1702888273,
		ssover: 21,
		fekit_ver: "8.100.460",
	},
	{
		name: "A9.0.0.0ebb1ecb",
		version: "9.0.0.14110",
		ver: "9.0.0",
		buildtime: 1701164403,
		subid: 537194351,
		apad_subid: 537194390,
		bitmap: 150470524,
		sdkver: "6.0.0.2557",
		qua: "V1_AND_SQ_9.0.0_5282_YYB_D",
		ssover: 21,
		fekit_ver: "8.0.456",
	},
	{
		name: "A8.9.93.bf80f08f",
		version: "8.9.93.13475",
		ver: "8.9.93",
		buildtime: 1697015435,
		subid: 537187398,
		apad_subid: 537187437,
		bitmap: 150470524,
		sdkver: "6.0.0.2556",
		qua: "V1_AND_SQ_8.9.93_5028_YYB_D",
		ssover: 21,
		fekit_ver: "7.301.417",
	},
	{
		name: "A8.9.90.cccfa0d0",
		version: "8.9.90.13250",
		ver: "8.9.90",
		buildtime: 1697015435,
		subid: 537185007,
		apad_subid: 537185046,
		bitmap: 150470524,
		sdkver: "6.0.0.2556",
		qua: "V1_AND_SQ_8.9.90_4938_YYB_D",
		ssover: 21,
		fekit_ver: "7.301.417",
	},
	{
		name: "A8.9.88.46a07457",
		version: "8.9.88.13035",
		ver: "8.9.88",
		buildtime: 1697015435,
		subid: 537182769,
		apad_subid: 537182808,
		bitmap: 150470524,
		sdkver: "6.0.0.2556",
		qua: "V1_AND_SQ_8.9.88_4852_YYB_D",
		ssover: 21,
		fekit_ver: "7.300.410",
	},
	{
		name: "A8.9.85.3377f9bf",
		version: "8.9.85.12820",
		ver: "8.9.85",
		buildtime: 1697015435,
		subid: 537180568,
		apad_subid: 537180607,
		bitmap: 150470524,
		sdkver: "6.0.0.2556",
		qua: "V1_AND_SQ_8.9.85_4766_YYB_D",
		ssover: 21,
		fekit_ver: "7.103.403",
	},
	{
		name: "A8.9.83.c9a61e5e",
		version: "8.9.83.12605",
		ver: "8.9.83",
		buildtime: 1691565978,
		subid: 537178646,
		apad_subid: 537178685,
		bitmap: 150470524,
		sdkver: "6.0.0.2554",
		qua: "V1_AND_SQ_8.9.83_4680_YYB_D",
		ssover: 20,
		fekit_ver: "7.102.401",
	},
	{
		name: "A8.9.80.57a42f50",
		version: "8.9.80.12440",
		ver: "8.9.80",
		buildtime: 1691565978,
		subid: 537176863,
		apad_subid: 537176902,
		bitmap: 150470524,
		sdkver: "6.0.0.2554",
		qua: "V1_AND_SQ_8.9.80_4614_YYB_D",
		ssover: 20,
		fekit_ver: "7.101.381",
	},
	{
		name: "A8.9.78.d5d9d71d",
		version: "8.9.78.12275",
		ver: "8.9.78",
		buildtime: 1691565978,
		subid: 537175315,
		apad_subid: 537175354,
		bitmap: 150470524,
		sdkver: "6.0.0.2554",
		qua: "V1_AND_SQ_8.9.78_4548_YYB_D",
		ssover: 20,
		fekit_ver: "7.100.363",
	},
	{
		name: "A8.9.76.cefd59d7",
		version: "8.9.76.12115",
		ver: "8.9.76",
		subid: 537173573,
		apad_subid: 537173621,
		qua: "V1_AND_SQ_8.9.76_4484_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2554",
		buildtime: 1691565978,
		ssover: 20,
		fekit_ver: "7.0.344",
	},
	{
		name: "A8.9.76.c71a1fa8",
		version: "8.9.76.12115",
		ver: "8.9.76",
		buildtime: 1691565978,
		subid: 537173477,
		apad_subid: 537173525,
		bitmap: 150470524,
		sdkver: "6.0.0.2554",
		qua: "V1_AND_SQ_8.9.76_4484_YYB_D",
		ssover: 20,
		fekit_ver: "7.0.344",
	},
	{
		name: "A8.9.75.354d41fc",
		version: "8.9.75.12110",
		ver: "8.9.75",
		buildtime: 1691565978,
		subid: 537173381,
		apad_subid: 537173429,
		bitmap: 150470524,
		sdkver: "6.0.0.2554",
		qua: "V1_AND_SQ_8.9.75_4482_YYB_D",
		ssover: 20,
		fekit_ver: "7.0.344",
	},
	{
		name: "A8.9.73.08fbad4d",
		version: "8.9.73.11950",
		ver: "8.9.73",
		subid: 537171785,
		apad_subid: 537171833,
		qua: "V1_AND_SQ_8.9.73_4416_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2553",
		buildtime: 1690371091,
		ssover: 20,
		fekit_ver: "7.0.337",
	},
	{
		name: "A8.9.73.5b437a51",
		version: "8.9.73.11945",
		ver: "8.9.73",
		subid: 537171689,
		apad_subid: 537171737,
		qua: "V1_AND_SQ_8.9.73_4416_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2553",
		buildtime: 1690371091,
		ssover: 20,
		fekit_ver: "7.0.337",
	},
	{
		name: "A8.9.71.9fd08ae5",
		version: "8.9.71.11735",
		ver: "8.9.71",
		subid: 537170024,
		apad_subid: 537170072,
		qua: "V1_AND_SQ_8.9.71_4332_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2551",
		buildtime: 1688720082,
		ssover: 20,
		fekit_ver: "7.0.326",
	},
	{
		name: "A8.9.70.b4332bd3",
		version: "8.9.70.11730",
		ver: "8.9.70",
		subid: 537169928,
		apad_subid: 537169976,
		qua: "V1_AND_SQ_8.9.70_4330_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2551",
		buildtime: 1688720082,
		ssover: 20,
		fekit_ver: "7.0.326",
	},
	{
		name: "A8.9.68.e757227e",
		version: "8.9.68.11565",
		ver: "8.9.68",
		subid: 537168313,
		apad_subid: 537168361,
		qua: "V1_AND_SQ_8.9.68_4264_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2549",
		buildtime: 1687254022,
		ssover: 20,
		fekit_ver: "7.0.300",
	},
	{
		name: "A8.9.63.5156de84",
		version: "8.9.63.11390",
		ver: "8.9.63",
		subid: 537164840,
		apad_subid: 537164888,
		qua: "V1_AND_SQ_8.9.63_4194_YYB_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2546",
		buildtime: 1685069178,
		ssover: 20,
		fekit_ver: "6.100.248",
	},
].map((shortInfo) => {
	// 固定信息
	return {
		id: "com.tencent.mobileqq",
		nt: true,
		appid: 16,
		app_key: "0S200MNJT807V3GE",
		sign: Buffer.from("A6B745BF24A2C277527716F6F36EB68D", "hex"),
		main_sig_map: 16724722,
		sub_sig_map: 66560,
		display: "Android",
		device_type: -1,
		bitmap: 0x08f7ff7c,
		client_ver: 8001,
		...shortInfo,
	};
});
const tim = [
	// 每个版本不同的信息
	{
		nt: true,
		name: "A4.1.0.e4e0ee28",
		version: "4.1.0.4050",
		ver: "4.1.0",
		subid: 537298353,
		apad_subid: 537298411,
		qua: "V1_AND_SQ_9.0.95_4050_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 1724313621,
		ssover: 22,
		fekit_ver: "8.402.854",
	},
	{
		nt: true,
		name: "A4.0.99.dc92ee7f",
		version: "4.0.99.4030",
		ver: "4.0.99",
		subid: 537282136,
		apad_subid: 537282194,
		qua: "V1_AND_SQ_9.0.95_4030_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 0x66c6f015,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.301.736",
	},
	{
		nt: true,
		name: "A4.0.98.2e3d9799",
		version: "4.0.98.4012",
		ver: "4.0.98",
		subid: 537264175,
		apad_subid: 537264222,
		qua: "V1_AND_SQ_9.0.95_4012_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 0x66c6f015,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.301.736",
	},
	{
		nt: true,
		name: "A4.0.97.3110ef2b",
		version: "4.0.97.4011",
		ver: "4.0.97",
		subid: 537263469,
		apad_subid: 537263596,
		qua: "V1_AND_SQ_9.0.95_4011_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 0x66c6f015,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.301.736",
	},
	{
		nt: true,
		name: "A4.0.96.6c784d54",
		version: "4.0.96.4010",
		ver: "4.0.96",
		subid: 537261131,
		apad_subid: 537261188,
		qua: "V1_AND_SQ_9.0.95_4010_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 0x66c6f015,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.301.736",
	},
	{
		nt: true,
		name: "A4.0.95.3b8db658",
		version: "4.0.95.4008",
		ver: "4.0.95",
		subid: 537249218,
		apad_subid: 537249147,
		qua: "V1_AND_SQ_9.0.95_4008_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2563",
		buildtime: 0x66c6f015,
		bitmap: 0x08f7ff7c,
		ssover: 0x16,
		fekit_ver: "8.301.736",
	},
	{
		name: "A3.5.8.0b4a96f9",
		version: "3.5.8.3228",
		ver: "3.5.8",
		subid: 537237656,
		qua: "V1_AND_SQ_8.3.9_358_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2484",
		buildtime: 1630062176,
		ssover: 18,
		fekit_ver: "8.200.582",
	},
	{
		name: "A3.5.7.877bb8bb",
		version: "3.5.7.3218",
		ver: "3.5.7",
		buildtime: 1630062176,
		subid: 537223825,
		bitmap: 150470524,
		sdkver: "6.0.0.2484",
		qua: "V1_AND_SQ_8.3.9_357_TIM_D",
		ssover: 18,
		fekit_ver: "8.200.552",
	},
	{
		name: "A3.5.6.20c82aa0",
		version: "3.5.6.3208",
		ver: "3.5.6",
		buildtime: 1630062176,
		subid: 537181169,
		bitmap: 150470524,
		sdkver: "6.0.0.2484",
		qua: "V1_AND_SQ_8.3.9_356_TIM_D",
		ssover: 18,
		fekit_ver: "7.101.411",
	},
	{
		name: "A3.5.5.fa2ef27c",
		version: "3.5.5.3198",
		ver: "3.5.5",
		buildtime: 1630062176,
		subid: 537177451,
		bitmap: 150470524,
		sdkver: "6.0.0.2484",
		qua: "V1_AND_SQ_8.3.9_355_TIM_D",
		ssover: 18,
		fekit_ver: "7.100.363",
	},
	{
		name: "A3.5.2.3f4af297",
		version: "3.5.2.3178",
		ver: "3.5.2",
		buildtime: 1630062176,
		subid: 537162286,
		bitmap: 150470524,
		sdkver: "6.0.0.2484",
		qua: "V1_AND_SQ_8.3.9_352_TIM_D",
		ssover: 18,
		fekit_ver: "0",
	},
	{
		name: "A3.5.1.db08e878",
		version: "3.5.1.3168",
		ver: "3.5.1",
		buildtime: 1630062176,
		subid: 537150355,
		bitmap: 150470524,
		sdkver: "6.0.0.2484",
		qua: "V1_AND_SQ_8.3.9_351_TIM_D",
		ssover: 18,
		fekit_ver: "0",
	},
	{
		name: "A3.5.0.88ad9c55",
		version: "3.5.0.3148",
		ver: "3.5.0",
		buildtime: 1630062176,
		subid: 537143920,
		qua: "V1_AND_SQ_8.3.9_350_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2484",
		ssover: 18,
		fekit_ver: "0",
	},
	{
		name: "A3.5.0.fda8b509",
		version: "3.5.0.3138",
		ver: "3.5.0",
		buildtime: 1630062176,
		subid: 537142492,
		qua: "V1_AND_SQ_8.3.9_350_TIM_D",
		channel: "GuanWang",
		sdkver: "6.0.0.2484",
		ssover: 18,
		fekit_ver: "0",
	},
].map((shortInfo) => {
	// 固定信息
	return {
		id: "com.tencent.tim",
		app_key: "0S200MNJT807V3GE",
		sign: Buffer.from("775e696d09856872fdd8ab4f3f06b1e0", "hex"),
		appid: 16,
		main_sig_map: 16724722,
		sub_sig_map: 0x10400,
		display: "Tim",
		device_type: -1,
		bitmap: 150470524,
		client_ver: 8001,
		...shortInfo,
	};
});
const watch = [
	{
		name: "Atestrevision",
		version: "2.0.8",
		ver: "2.0.8",
		buildtime: 1559564731,
		subid: 537065138,
		bitmap: 16252796,
		sdkver: "6.0.0.2365",
		qua: "",
		ssover: 5,
	},
	{
		name: "Atestrevision",
		version: "9.0.7.2561",
		ver: "9.0.7",
		subid: 537282233,
		channel: "",
		sdkver: "6.0.0.2564",
		qua: "V1_WAT_SQ_9.0.7_0_IDC_B",
		buildtime: 1724730201,
		ssover: 22,
		fekit_ver: "8.403.543",
	},
	{
		name: "Atestrevision",
		version: "9.0.5.2533",
		ver: "9.0.5",
		subid: 537258298,
		channel: "",
		sdkver: "6.0.0.2564",
		qua: "V1_WAT_SQ_9.0.3_0_IDC_B",
		buildtime: 1724730201,
		ssover: 22,
		fekit_ver: "8.208.537",
	},
	{
		name: "Atestrevision",
		version: "9.0.3.2508",
		ver: "9.0.3",
		subid: 537243416,
		channel: "",
		sdkver: "6.0.0.2498",
		qua: "V1_WAT_SQ_9.0.3_0_IDC_B",
		buildtime: 1648001696,
		ssover: 18,
		fekit_ver: "8.105.526",
	},
	{
		name: "Atestrevision",
		version: "9.0.1.2451",
		ver: "9.0.1",
		subid: 537214131,
		channel: "",
		sdkver: "6.0.0.2498",
		qua: "V1_AND_SQ_8.9.68_0_RDM_B",
		buildtime: 1648001696,
		ssover: 18,
		fekit_ver: "8.105.526",
	},
	{
		name: "Atestrevision",
		version: "2.1.7",
		ver: "2.1.7",
		buildtime: 1654570540,
		subid: 537140974,
		bitmap: 16252796,
		sdkver: "6.0.0.2366",
		qua: "V1_WAT_SQ_2.1.7_002_IDC_B",
		ssover: 5,
		fekit_ver: "0",
	},
].map((shortInfo) => {
	// 固定信息
	return {
		id: "com.tencent.qqlite",
		app_key: "0S200MNJT807V3GE",
		sign: Buffer.from(
			"A6 B7 45 BF 24 A2 C2 77 52 77 16 F6 F3 6E B6 8D"
				.split(" ")
				.map((s) => parseInt(s, 16))
		),
		appid: 16,
		main_sig_map: 16724722,
		sub_sig_map: 0x10400,
		display: "Watch",
		device_type: 8,
		bitmap: 150470524,
		client_ver: 8001,
		...shortInfo,
	};
});
const hd = {
	id: "com.tencent.qq",
	app_key: "0S200MNJT807V3GE",
	name: "A6.8.2.21241",
	version: "6.8.2.21241",
	ver: "6.8.2",
	/*sign: Buffer.from(
      "AA 39 78 F4 1F D9 6F F9 91 4A 66 9E 18 64 74 C7".split(" ").map(s => parseInt(s, 16)),
  ),*/
	sign: mobile[0].sign,
	buildtime: 1647227495,
	appid: 16,
	subid: 537128930,
	bitmap: 150470524,
	main_sig_map: 1970400,
	sub_sig_map: 66560,
	sdkver: "6.2.0.1023",
	display: "iMac",
	device_type: 5,
	qua: "",
	ssover: 12,
	client_ver: 8001,
};

export function checkMyVersion(subid) {
	/**
	 * @typedef {Object} QQVersionInfo
	 * @property {string} name          - 版本名称，例如 "A9.2.27.636ed9e0"
	 * @property {string} version       - 完整版本号，例如 "9.2.27.31300"
	 * @property {string} ver           - 主版本号，例如 "9.2.27"
	 * @property {number} subid         - subid 值
	 * @property {number} apad_subid    - Android Pad subid
	 * @property {string} qua           - QUA 字段，例如 "V1_AND_SQ_9.2.27_12160_YYB_D"
	 * @property {string} channel       - 渠道号，例如 "GuanWang"
	 * @property {string} sdkver        - SDK 版本号，例如 "6.0.0.2589"
	 * @property {number} buildtime     - 构建时间戳（秒）
	 * @property {number} ssover        - SSO 版本
	 * @property {string} fekit_ver     - FEKit 版本号，例如 "8.500.910"
	 */

	const subId = subid;

	const androids = mobile;
	const watchs = watch;
	const tims = tim;

	/**
	 * @type {QQVersionInfo}
	 */
	var userAndroid;

	var found = false;
	var type = 1;

	for (let index = 0; index < androids.length; index++) {
		/**
		 * @type {QQVersionInfo}
		 */
		const android = androids[index];

		if (
			subId.toString().substring(2, 6) ==
			android.subid.toString().substring(2, 6)
		) {
			userAndroid = android;
			found = true;
			break;
		}
	}

	if (!found) {
		for (let index = 0; index < watchs.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = watchs[index];

			if (
				subId.toString().substring(2, 6) ==
				android.subid.toString().substring(2, 6)
			) {
				userAndroid = android;
				type = 2;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < tims.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = tims[index];

			if (
				subId.toString().substring(2, 6) ==
				android.subid.toString().substring(2, 6)
			) {
				userAndroid = android;
				type = 3;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < windows.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = windows[index];

			if (subId.toString() == android.subid.toString()) {
				userAndroid = android;
				type = 5;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < macos.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = macos[index];

			if (subId.toString() == android.subid.toString()) {
				userAndroid = android;
				type = 6;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < linux.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = linux[index];

			if (subId.toString() == android.subid.toString()) {
				userAndroid = android;
				type = 4;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		for (let index = 0; index < linux.length; index++) {
			/**
			 * @type {QQVersionInfo}
			 */
			const android = mobile_old[index];

			if (
				subId.toString().substring(2, 6) ==
				android.subid.toString().substring(2, 6)
			) {
				userAndroid = android;
				type = 1;
				found = true;
				break;
			}
		}
	}

	if (!found) {
		return "未收录";
	} else {
		switch (type) {
			case 1:
				return `你的 QQ 版本为 ${userAndroid.version}`;
			case 2:
				return `你的手表 QQ 版本为 ${userAndroid.version}`;
			case 3:
				return `你的 Tim 版本为 ${userAndroid.version}`;
			case 4:
				return `你的 Linux QQ 版本为 ${userAndroid.version}`;
			case 5:
				return `你的 Windows QQ 版本为 ${userAndroid.version}`;
			case 6:
				return `你的 MacOS QQ 版本为 ${userAndroid.version}`;
			default:
				break;
		}
	}
}

export default defineScript(async (ctx) => {
	ctx.napcat.on("message.group", async (msg) => {
		try {
			if (
				msg.group_id === 1076243407 &&
				msg.raw_message.startsWith("#subid")
			) {
				const subid = msg.raw_message.replace("#subid", "").trim();
				ctx.napcat.send_group_msg({
					group_id: msg.group_id,
					message: Structs.text(checkMyVersion(subid)),
				});
			}
		} catch (error) {
			logger.warn(error);
		}
	});

	ctx.app.get("/get_subid", async (req, res) => {
		try {
			const token = req.query.token;
			const client = await getClientByToken(token);
			if (!client) {
				return res.status(403).send({ msg: "403" });
			}

			res.send({ linux, macos, windows, mobile_old, mobile, tim, watch });
		} catch (error) {}
	});
});

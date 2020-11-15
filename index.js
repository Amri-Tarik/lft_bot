const Discord = require("discord.js");
const prefix = process.env.PREFIX;
const token = process.env.TOKEN;
const guild_id = process.env.GUILD_ID;
const channel_id = process.env.CHANNEL_ID;
const message_id = process.env.MESSAGE_ID;
const recruit_id = process.env.RECRUIT_ID;
const client = new Discord.Client();
var randomColor = require("randomcolor");
const Database = require("@replit/database");
const db = new Database();
// import "randomcolor";

client.once("ready", () => {
	client.guilds.cache
		.get(guild_id)
		.channels.cache.get(channel_id)
		.messages.fetch(message_id)
		.then((message) => {
			checking_loop(message);
		});
	console.log("Ready!")
});

client.on("message", (message) => {
	if (message.content.startsWith(prefix + " brahim")) {
		checking_loop(message);
	} else if (message.content.startsWith(prefix + " delete")) {
		deleting(message);
	} else if (message.content.startsWith(prefix + " recruit")) {
		announcement(message);
	} else if (message.content.startsWith(prefix + " del recruit")) {
		delete_announce(message);
	} else if (message.content.startsWith(prefix + " invite")) {
		invite_user(message);
	} else if (message.content.startsWith(prefix + " kick")) {
		kick_user(message);
	} else if (message.content.startsWith("we simohamed lo7 chi meme")) {
		message.channel.send("OUAQUAD_1.3.6");
	}
});

function kick_user(message) {
	db.get(message.channel.name.replace("team-", "")).then((team) => {
		if (team && message.author.id === team.owner) {
			nickname = message.content.replace(`${prefix} kick `, "");
			member = client.guilds.cache.get(guild_id).members.fetch({query: nickname, limit : 1}).then((member) => {
				member = member.first();
				if (member) {
					member.roles.remove(team.role);
					message.reply(`${member.nickname} kicked from the team`);
				} else {
			member = client.guilds.cache
					.get(guild_id)
					.members.cache.find((member) => member.user.username === nickname);
			if (member) {
						member.roles.remove(team.role);
					message.reply(`${nickname} kicked from the team`);
					} else {
					message.reply(
						"je n'ai pas trouvé cet utilisateur, reverifie le nom avec les majusqules et les symboles, sinon contactez le staff pour qu'il le vire manuellement."
						);
			}
				} ; })
		} else if (team && message.author.id !== team.owner) {
			message.reply(
				"seul le créateur de cette team peut utiliser cette commande"
			);
		} else {
			message.reply(
				"cette commande doit être utilisée dans le chat Team"
			);
		}
	});
}

function invite_user(message) {
	db.get(message.channel.name.replace("team-", "")).then((team) => {
		if (team) {
			nickname = message.content.replace(`${prefix} invite `, "");
			client.guilds.cache.get(guild_id).members.fetch({query: nickname, limit : 1}).then((member) => {
				member = member.first();
			if (member) {
				member.roles.add(team.role);
				message.channel.send(`mr7ba b ${member} f team`);
			} else {
        		member = client.guilds.cache
				.get(guild_id)
				.members.cache.find((member) => member.user.username === nickname);
        if (member) {
				  member.roles.add(team.role);
			  	message.channel.send(`mr7ba b ${member} f team`);
        } else {
          message.reply(
					"je n'ai pas trouvé cet utilisateur, reverifie le nom avec les majusqules et les symboles, sinon contactez le staff pour qu'il l'ajoute manuellement. "
				);
        }
			} })
		} else {
			message.reply(
				"cette commande doit être utilisée dans le chat Team"
			);
		}
	});
}

function delete_announce(message, chnldel = false) {
	db.get(message.channel.name.replace("team-", "")).then((team) => {
		if (team && team.embed) {
			client.guilds.cache
				.get(guild_id)
				.channels.cache.get(recruit_id)
				.messages.fetch(team.embed)
				.then((message) => message.delete());
			team.embed = null;
			db.set(team.id, team);
			message.reply("votre annonce a été supprimé");
		} else if (!team.embed && !chnldel) {
			message.reply("aucune annonce n'a été trouvée");
		} else if (!chnldel) {
			message.reply(
				"cette commande doit être utilisée dans le chat Team"
			);
		}
	});
}

function announcement(message) {
	delete_announce(message, true);
	db.get(message.channel.name.replace("team-", "")).then((team) => {
		if (team) {
			let recruting = [];
			const filter = () => {
				return true;
			};
			message.channel.send(
				"On va créer une annonce pour votre Team. Veuillez répondre à ces questions dans le meme chat. l'opération va s'annuler si vous écrivez ' - ' dans le chat ou que vous restiez inactifs pendant 5 minutes. Vous pouvez aussi ecrire ' * ' pour laisser un champ vide si vous le souhaitez. Vous avez une limite de 1000 caractères par réponse alors soyez concis ."
			);
			message.channel
				.send(
					"Commençons par parler du projet. décrivez ce que votre projet vise a faire, comment vous comptez le réaliser et les technologies principales utilisées. Ne donnez pas d'informations critiques ou vous risquez le vol de vos idées !"
				)
				.then(() => {
					message.channel
						.awaitMessages(filter, {
							max: 1,
							time: 300000,
							errors: ["time"],
						})
						.then((collected1) => {
							if (collected1.first().content === "-") {
								throw Error;
							}
							recruting.push(collected1.first().content);
						})
						.then(() => {
							message.channel
								.send(
									"Parlons maintenant des personnes que vous voulez dans votre team. Quelles technologies doivent t'ils savoir/apprendre et à quel niveau(debutant-expert). est-ce pour une activité professionelle ou non. doivent t'ils présenter un CV ou avoir un portfolio. "
								)
								.then(() => {
									message.channel
										.awaitMessages(filter, {
											max: 1,
											time: 300000,
											errors: ["time"],
										})
										.then((collected2) => {
											if (
												collected2.first().content ===
												"-"
											) {
												throw Error;
											}
											recruting.push(
												collected2.first().content
											);
										})
										.then(() => {
											message.channel
												.send(
													"Parlons maintenant de la durée du projet(en jours ou mois) et peut-être combien d'heures par semaine sont attendues"
												)
												.then(() => {
													message.channel
														.awaitMessages(filter, {
															max: 1,
															time: 300000,
															errors: ["time"],
														})
														.then((collected3) => {
															if (
																collected3.first()
																	.content ===
																"-"
															) {
																throw Error;
															}
															recruting.push(
																collected3.first()
																	.content
															);
														})
														.then(() => {
															message.channel
																.send(
																	"vous pouvez ajouter un détail si vous voulez a la fin de votre offre ou écrire '*' si vous n'avez rien d'autre à ajouter"
																)
																.then(() => {
																	message.channel
																		.awaitMessages(
																			filter,
																			{
																				max: 1,
																				time: 300000,
																				errors: [
																					"time",
																				],
																			}
																		)
																		.then(
																			(
																				collected4
																			) => {
																				if (
																					collected4.first()
																						.content ===
																					"-"
																				) {
																					throw Error;
																				}
																				recruting.push(
																					collected4.first()
																						.content
																				);

																				embed_creation(
																					recruting,
																					team
																				);
																			}
																		)
																		.catch(
																			() => {
																				message.channel.send(
																					"annulation de la création d'offre de recrutement"
																				);
																			}
																		);
																});
														})
														.catch(() => {
															message.channel.send(
																"annulation de la création d'offre de recrutement"
															);
														});
												});
										})
										.catch(() => {
											message.channel.send(
												"annulation de la création d'offre de recrutement"
											);
										});
								});
						})
						.catch(() => {
							message.channel.send(
								"annulation de la création d'offre de recrutement"
							);
						});
				});
		} else {
			message.channel.send(
				"cette commande doit être utilisée dans le chat Team"
			);
		}
	});
}

function embed_creation(listing, team) {
	client.guilds.cache
		.get(guild_id)
		.members.fetch(team.owner)
		.then((owner) => {
			listing = listing.map((element) => {
				if (element == "*") {
					return "Non mentionné";
				} else {
					return element;
				}
			});
			const exampleEmbed = new Discord.MessageEmbed()
				.setColor(randomColor())
				.setTitle(`Team ${team.id} recrute !`)
				.setAuthor(owner.nickname, owner.user.displayAvatarURL())
				.setDescription(
					`Pour rejoindre cette equipe veillez contacter ${owner.user}`
				)
				.addFields(
					{ name: "Description du projet", value: listing[0] },
					{ name: "Profil demandé", value: listing[1] },
					{
						name: "duration et heures par semaine",
						value: listing[2],
					},
					{
						name: "details additionels",
						value: listing[3],
					}
				)
				.setTimestamp()
				.setFooter(
					`Pour supprimer ce poste, utilisez la commande "${prefix} del recruit" dans le chat Team`
				);

			client.guilds.cache
				.get(guild_id)
				.channels.cache.get(recruit_id)
				.send(exampleEmbed)
				.then((message) => {
					team.embed = message.id;
					db.set(team.id, team);
				});
		});
}

function deleting(message) {
	delete_announce(message, true);
	db.get(message.channel.name.replace("team-", "")).then((team) => {
		if (
			(team && message.author.id === team.owner) ||
			message.author.id === "202016708620189697"
		) {
			const filter = (response) => {
				return Number(response.content) === Number(team.id);
			};
			message.channel
				.send(
					"Ecrire le numero de la team pour confirmer la suppression. vous avez 30 secondes pour le faire"
				)
				.then(() => {
					message.channel
						.awaitMessages(filter, {
							max: 1,
							time: 30000,
							errors: ["time"],
						})
						.then(() => {
							message.channel.send(
								`team ${team.id} va étre supprimé, bonne journée`
							);
							guild = message.guild;
							guild.channels.cache.get(team.chat).delete();
							guild.channels.cache
								.get(team.ressource_chat)
								.delete();
							guild.channels.cache.get(team.voice_chat).delete();
							guild.channels.cache.get(team.category).delete();
							guild.roles.cache.get(team.role).delete();
							db.delete(team.id);
						})
						.catch((collected) => {
							message.channel.send(
								"annulation de la suppression de la team"
							);
						});
				});
		} else if (team && message.author.id !== team.owner) {
			message.reply(
				"seul le créateur de la team peut utiliser cette commande"
			);
		} else {
			message.channel.send(
				"cette commande doit être utilisée dans le chat Team"
			);
		}
	});
}

function checking_loop(message) {
	message.react("▶️");
	const filter = (reaction) => {
		return reaction.emoji.name === "▶️";
	};
	message.awaitReactions(filter, { max: 2 }).then((collected) => {
		let reaction = collected.first();
		reaction.users.cache.each((element) => {
			if (element.username != "simohamed") {
				team_creation(element, message.guild.id);
			}
		});
		message.reactions
			.removeAll()
			.catch((error) =>
				console.error("Failed to clear reactions: ", error)
			);
		checking_loop(message);
	});
}

function team_creation(element, guild_id) {
	let team_data = {
		id: 0,
		chat: "temp",
		ressource_chat: "temp",
		voice_chat: "temp",
		category: "temp",
		owner: "temp",
		role: "temp",
	};
	let guild = client.guilds.cache.get(guild_id);
	let guildmember = guild.members.cache.get(element.id);
	team_data.owner = String(guildmember.id);
	team_data.members = [guildmember.id];
	db.get(0).then((entry) => {
		team_id = entry.id + 1;
		team_data.id = Number(team_id);
		const everyone = guild.roles.cache.get(guild.id);
		guild.roles
			.create({
				data: {
					name: `team ${team_id}`,
					color: randomColor(),
				},
			})
			.then((role) => {
				team_data.role = String(role.id);
				guildmember.roles.add(role);
				guild.channels
					.create(`team-${team_id}`, {
						type: "category",
						permissionOverwrites: [
							{
								id: everyone,
								deny: ["VIEW_CHANNEL"],
							},
							{
								id: role,
								allow: ["VIEW_CHANNEL"],
							},
						],
					})
					.then((channel) => {
						team_data.category = String(channel.id);
						guild.channels
							.create(`team-${team_id}`, { parent: channel })
							.then((channel2) => {
								team_data.chat = String(channel2.id);
								guild.channels
									.create(`team-${team_id}-ressources`, {
										parent: channel,
									})
									.then((channel3) => {
										team_data.ressource_chat = String(
											channel3.id
										);
										guild.channels
											.create(`team-${team_id}-voice`, {
												parent: channel,
												type: "voice",
											})
											.then((channel4) => {
												team_data.voice_chat = String(
													channel4.id
												);
												db.set(team_data.id, team_data);
												db.set(0, { id: team_id });
												guildmember.send(
													`Hey ${guildmember.nickname}, ta team a été créée avec le nombre ${team_data.id}. vous trouverez un chat appelé Team-${team_data.id} dans le serveur qui contiendra les commandes necessaire pour gérer ta team, recruter des gens et plus...`
												);
												channel2.send(
													`Bienvenu ! team-${team_data.id}, team-${team_data.id}-ressources et team-${team_data.id}-voice sont maintenant seulement visibles pas vous, les personnes avec le rôle team ${team_data.id} (vous devrez les inviter à la team pour leur donner ce rôle) et le staff.\nListe des commandes disponibles :\
													\n	${prefix} invite <nom de l'utilisateur> : inviter quelqu'un a la team, sensible a la casse.\
													\n	${prefix} kick <nom de l'utilisateur> : virer quelqu'un de la team, sensible a la casse, seul le créateur de la team peut l'utiliser.\
													\n	${prefix} recruit : permet de créer un annonce de recrutement pour votre team.\
													\n	${prefix} del recruit : supprime votre annonce de recrutement.\
													\n	${prefix} delete : supprime les 3 chats de la team avec les données inclues, seul le créateur de la team peut l'utiliser. attention ! une fois la suppression confirmée, cette action est irréversible.\
													\nToutes ces commandes ne peuvent être utilisées qu'a l'intérieur de ce chat. Bonne chance pour votre projet !`
												);
											});
									});
							});
					});
			});
	});
	// const team = Teams.create(team_data);
}

client.login(token);

const http = require("http");
const server = http.createServer((req, res) => {
	res.writeHead(200);
	res.end("ok");
});
server.listen(3000);

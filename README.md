# Disend

[![CI](https://github.com/ryanlua/disend/actions/workflows/ci.yml/badge.svg)](https://github.com/ryanlua/disend/actions/workflows/ci.yml)
[![Discord](https://discord.com/api/guilds/1387009688641732639/widget.png)](https://discord.gg/XkAHS8MkTe)
[![GitHub License](https://img.shields.io/github/license/ryanlua/disend)](https://github.com/ryanlua/disend?tab=MIT-1-ov-file#readme)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)

Send message components on your Discord server with Disend. Create high-quality rules, FAQs, and more on any channel and self-host the app for a professional look.

## Hosting your own Disend clone

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fryanlua%2Fdisend)

> [!TIP]
> This guide is for developers who want to set up their own Disend clone. You can install the official Disend app using the [install link](https://discord.com/oauth2/authorize?client_id=1239324702514745386).

Disend is powered by [Cloudflare Workers](https://workers.cloudflare.com/) which requires you to [create a Cloudflare account](https://developers.cloudflare.com/fundamentals/account/create-account/). You only need a [Workers Free plan](https://developers.cloudflare.com/workers/platform/limits/#worker-limits) and don't need to pay anything.

It is recommended you [make your first Discord app](https://discord.com/developers/docs/quick-start/getting-started) before you start setting up Disend, so you are familiar with the Discord Developer Portal and how to create an app. Additionally, you can follow the [deploying Discord apps on Cloudflare Workers tutorial](https://docs.discord.com/developers/tutorials/hosting-on-cloudflare-workers) to get a better understanding of how hosting Discord apps on Cloudflare Workers works in general.

This guide will walk you through the steps to create, configure, and deploy your own Disend clone without needing to write any code or install anything on your machine.

### Deploying to Cloudflare Workers

You will need to [create a Discord app](https://discord.com/developers/applications?new_application=true) in the Discord Developer Portal if you haven't already.

After you create your app, you'll land on the **General Information** page of the app's settings where you can update basic information about your app like its description and icon.

Here you will also find your app credentials that Cloudflare needs to deploy your Disend clone.

[Create the Disend Workers application](https://deploy.workers.cloudflare.com/?url=https%3A%2F%2Fgithub.com%2Fryanlua%2Fdisend) or click the **Deploy to Cloudflare** button on the top of this page and enter the following values from your Discord app's settings:

* On the **General Information** page, copy the value for **Application ID**. In Cloudflare, enter your pasted value in `DISCORD_APPLICATION_ID`

  ![Application ID on General Information page in App Settings](assets/application-id.png)

* Back on the **General Information** page, copy the value for **Public Key**. In Cloudflare, enter your pasted value in `DISCORD_PUBLIC_KEY`

  ![Public Key on General Information page in App Settings](assets/public-key.png)

* On the **Bot** page under **Token**, click "Reset Token" to generate a new bot token. In Cloudflare, enter your pasted value in `DISCORD_TOKEN`

  ![Token on Bot page in App Settings](assets/token.png)

> [!WARNING]
> Make sure to never share your token or check it into any kind of version control or someone could take control of your bot.

When you have entered all the values, click **Save and deploy**. This will deploy your Disend clone to Cloudflare Workers.

### Configuring your Discord app

You will need to configure your Discord app to allow it to be installed on servers along with setting up an install link for users to install your app. Your app can either be public or private. If your app is public, then anyone can find it and install it. If your app is private, then only you can install it using the install link.

<details>

<summary>Private Bot</summary>

#### OAuth2 Authorizations

On the **Bot** page, then under **Authorization Flow**, make sure "Public Bot" is not selected.

#### Installation Contexts

On the **Installation** page, then under **Installation Contexts** make sure "Guild Install" is selected.

![Installation contexts section on Installation page in App Settings](assets/installation-contexts.png)

#### Install Link

On the **Installation** page, go to the **Install Link** section and select "None".

#### Add App

On the **OAuth2** page, then under **OAuth2 URL Generator**, add the `applications.commands` and `bot` scope and under **Bot Permissions**, add the `Send Messages` and `View Channels` permission.

Copy the **Generated URL** and paste it in your browser to add your bot to your server. It should look like this:

```
https://discord.com/oauth2/authorize?client_id=1239324702514745386&permissions=3072&integration_type=0&scope=bot
```

</details>

<details>

<summary>Public Bot</summary>

#### OAuth2 Authorizations

On the **Bot** page, then under **Authorization Flow**, make sure "Public Bot" is selected.

#### Installation Contexts

On the **Installation** page, then under **Installation Contexts** make sure "Guild Install" is selected.

![Installation contexts section on Installation page in App Settings](assets/installation-contexts.png)

#### Install Link

On the **Installation** page, go to the **Install Link** section and select "Discord Provided Link" if it's not already selected.

When **Discord Provided Link** is selected, a new **Default Install Settings** section will appear, which we'll configure next.

![Install link section on Installation page in App Settings](assets/install-link.png)

#### Scopes and Bot Permissions

On the **Installation** page in the **Default Install Settings** section:

* For **Guild Install**, add the `applications.commands` and `bot` scope and the `Send Messages` and `View Channels` permission.

![Default Install Settings on Installation page in App Settings](assets/default-install-settings.png)

#### Add App

On the **Installation** page, go to the **Install Link** section and copy the Discord provided install link and paste it in your browser to add your bot to your server. It should look like this:

```
https://discord.com/oauth2/authorize?client_id=1239324702514745386
```

</details>

#### Interaction Endpoint URL

Go to your app's settings and on the **General Information** page under **Interaction Endpoint URL**, paste your workers.dev URL and append `/interactions`.

![Interaction Endpoint URL on General Information page in App Settings](assets/interactions-endpoint-url.png)

Click **Save Changes** and ensure your endpoint is successfully verified.

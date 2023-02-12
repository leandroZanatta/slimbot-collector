package br.com.slimbot.collector.util;

import org.apache.commons.io.FileUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class CookieStorage {

    private static File cookiesFile = new File("cookies.json");

    private static Map<Integer, Map<String, String>> cookies;

    static {
        if (!cookiesFile.exists()) {

            cookies = new HashMap<>();

            storeCookies();

        } else {

            cookies = new HashMap<>();

            try {

                JSONObject jsonObject = new JSONObject(FileUtils.readFileToString(cookiesFile, StandardCharsets.UTF_8));
                Iterator<String> faucets = jsonObject.keys();

                while (faucets.hasNext()) {
					Integer faucet =Integer.valueOf( faucets.next());

					cookies.put(faucet, new HashMap<>());

					JSONObject cookiesObject = jsonObject.getJSONObject(faucet.toString());

					Iterator<String> cookieKeys = cookiesObject.keys();

					while (cookieKeys.hasNext()) {

						String cookie = cookieKeys.next();

						cookies.get(faucet).put(cookie,cookiesObject.getString(cookie));
					}
				}

            } catch (IOException | JSONException e) {

                storeCookies();
            }
        }
    }

    public static void setCookiesStorage(Integer faucet, List<String> cookiesSite) {

        Map<String, String> cookiesAtuais = getCookiesStorage(faucet);

        for (int i = 0; i < cookiesSite.size(); i++) {

            String[] cookiesSplit = cookiesSite.get(i).split(";");

            for (int j = 0; j < cookiesSplit.length; j++) {

                String key = cookiesSplit[j].trim().split("=")[0].trim();

                cookiesAtuais.put(key, cookiesSplit[j].trim());
            }
        }

        cookies.put(faucet, cookiesAtuais);

        storeCookies();
    }

    public static Map<String, String> getCookiesStorage(Integer faucet) {

        if (cookies.containsKey(faucet)) {
            return cookies.get(faucet);
        }

        return new HashMap<>();
    }

    public static void removeCookiesStorage(Integer faucet) {
        cookies.remove(faucet);
    }

    private static void storeCookies() {

        try {

            FileUtils.writeStringToFile(cookiesFile, new JSONObject(cookies).toString(), StandardCharsets.UTF_8);

        } catch (IOException e) {
        }
    }

}

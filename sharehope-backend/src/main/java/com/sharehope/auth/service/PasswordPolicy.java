package com.sharehope.auth.service;

import com.sharehope.user.model.User;
import java.util.List;
import java.util.stream.Stream;
import org.springframework.stereotype.Component;

@Component
public class PasswordPolicy {
    public static final String REQUIREMENTS =
            "Use 12–128 characters with uppercase, lowercase, a number, and a symbol. Do not use spaces or personal information.";

    private static final List<String> BLOCKED = List.of(
            "password", "sharehope", "administrator", "qwerty", "letmein", "welcome", "changeme");

    public void validate(String password, User user) {
        if (password == null || password.length() < 12 || password.length() > 128
                || password.chars().anyMatch(Character::isWhitespace)
                || password.chars().noneMatch(Character::isUpperCase)
                || password.chars().noneMatch(Character::isLowerCase)
                || password.chars().noneMatch(Character::isDigit)
                || password.chars().allMatch(Character::isLetterOrDigit)) {
            throw new IllegalArgumentException(REQUIREMENTS);
        }

        String normalized = password.toLowerCase();
        String emailName = user.getEmail() == null ? "" : user.getEmail().split("@", 2)[0].toLowerCase();
        boolean containsPersonalInformation = Stream.of(user.getFirstName(), user.getLastName(), emailName)
                .filter(value -> value != null && value.length() >= 3)
                .map(String::toLowerCase)
                .anyMatch(normalized::contains);
        if (containsPersonalInformation || BLOCKED.stream().anyMatch(normalized::contains)) {
            throw new IllegalArgumentException("Choose a password that does not contain your name, email, organization name, or a common password.");
        }
    }
}

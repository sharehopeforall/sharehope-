package com.sharehope;

import static org.assertj.core.api.Assertions.assertThat;
import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Assumptions;
import org.junit.jupiter.api.Test;

class PostgresMigrationTest {
    @Test
    void allMigrationsApplyToPostgresFromAnEmptyDatabase() {
        String url = System.getenv("MIGRATION_TEST_DATABASE_URL");
        Assumptions.assumeTrue(url != null && url.contains("sharehope_migration_test"),
                "Dedicated PostgreSQL migration database is not configured");
        String username = System.getenv().getOrDefault("MIGRATION_TEST_DATABASE_USER", "postgres");
        String password = System.getenv().getOrDefault("MIGRATION_TEST_DATABASE_PASSWORD", "postgres");
        Flyway flyway = Flyway.configure().dataSource(url, username, password)
                .locations("classpath:db/migration").cleanDisabled(false).load();
        flyway.clean();
        assertThat(flyway.migrate().success).isTrue();
        assertThat(flyway.validateWithResult().validationSuccessful).isTrue();
    }
}

-- Early versions of the volunteer form submitted the select option index
-- instead of its visible role label. Repair only the known numeric values.
UPDATE public_submissions
SET subject = CASE
    WHEN locale = 'fr' THEN CASE subject
        WHEN '0' THEN 'Aider sur le terrain'
        WHEN '1' THEN 'Partager vos talents'
        WHEN '2' THEN 'Soutenir nos événements'
        WHEN '3' THEN 'Faire passer le mot'
    END
    ELSE CASE subject
        WHEN '0' THEN 'Help on the ground'
        WHEN '1' THEN 'Share your skills'
        WHEN '2' THEN 'Support our events'
        WHEN '3' THEN 'Spread the word'
    END
END
WHERE submission_type = 'VOLUNTEER'
  AND subject IN ('0', '1', '2', '3');

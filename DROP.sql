-- DROP TABLE "__EFMigrationsHistory" CASCADE;
-- DROP TABLE "user" CASCADE;
-- DROP TABLE "comment" CASCADE;
-- DROP TABLE "content" CASCADE;
-- DROP TABLE "document" CASCADE;
-- DROP TABLE "project" CASCADE;
-- DROP TABLE "ticket" CASCADE;
-- DROP TABLE "member" CASCADE;
-- DROP TABLE "activity" CASCADE;

-- SELECT d.id, d.name, c.owner_id
-- FROM content AS c
-- INNER JOIN document AS d ON d.content_id = c.id
-- WHERE c.id = '01H2GDFW1BF9GD96MZWXGYGS06'
-- LIMIT 1

-- SELECT GROUP_CONCAT(d.name) AS document_names,
-- c.markdown AS markdown, c.content_id AS content_id
-- FROM user AS u
-- INNER JOIN content AS c ON u.content_id = c.id
-- INNER JOIN document AS d ON d.content_id = c.id
-- WHERE u.id = '01H2GDFW0RQZ071BDWYK9HRG11'
-- GROUP BY u.id;


-- INSERT INTO document (content_id, "name", id)
-- VALUES ('01H2GDFW1BF9GD96MZWXGYGS06', 'test delete me plase', '01H2GDFW1BF9GD96MZWXGYGS06')
